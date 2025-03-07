import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import Job from '@/app/models/Job';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate request body
    const { offerId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Update offer status in MongoDB
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    if (!updatedOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }
    // Get surgeon info (offer creator)
    const surgeon = await User.findById(updatedOffer.createdBy);
    if (!surgeon) {
      return NextResponse.json({ error: 'Surgeon not found' }, { status: 404 });
    }
    const job = await Job.findById(updatedOffer.jobId);
    if (!job) {
      return NextResponse.json({ error: 'Surgeon not found' }, { status: 404 });
    }

    // Send a notification using Pusher
    await pusherServer.trigger(
      toPusherKey(`user:${updatedOffer.createdBy}:chats`),
      'notification_toast',
      {
        receiver: updatedOffer.createdBy,
        sender: session.user.id,
        senderName: session.user.name || 'Patient',
        senderImg: session.user.image || '/default.png',
        content: `Your offer for job ${
          job.title || 'Unknown Job'
        } has been ${status}`,
        timestamp: new Date().toISOString(),
        jobId: job._id.toString(),
        type: 'offer',
      }
    );

    return NextResponse.json(updatedOffer, { status: 200 });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
