import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import User from '@/app/models/User';
import Job from '@/app/models/Job';
import Notification from '@/app/models/Notification';
import dbConnect from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { offerId: string } }
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
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Update offer status in MongoDB
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    ).populate('jobId');

    if (!updatedOffer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Get job info
    const job = await Job.findById(updatedOffer.jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get surgeon info
    const surgeon = await User.findById(updatedOffer.createdBy);
    if (!surgeon) {
      return NextResponse.json({ error: 'Surgeon not found' }, { status: 404 });
    }

    // Send a notification using Pusher
    await pusherServer.trigger(
      toPusherKey(`user:${updatedOffer.createdBy}:chats`),
      'notification_toast',
      {
        isOfferResponse: true,
        offerStatus: status,
        receiver: updatedOffer.createdBy.toString(),
        sender: session.user.id,
        senderName: session.user.name || 'Patient',
        senderImg: session.user.image || '/default.png',
        content: `Your offer for "${job.title}" has been ${status}`,
        timestamp: new Date().toISOString(),
        jobId: job._id.toString(),
      }
    );

    // Create notification in database
    try {
      const notificationMessage = `Your offer for "${job.title}" has been ${status}`;
      const notificationLink = `/dashboard/jobs/${job._id}`;
      const notificationType = status === 'accepted' ? 'offer_accepted' : 'offer_declined';
      

      const newNotification = new Notification({
        jobId: job._id,
        message: notificationMessage,
   
        isSeen: false,
        senderId: session.user.id,
        receiverId: updatedOffer.createdBy,
        notificationType,
      });
      await newNotification.save();
    } catch (error) {
      console.error("Failed to create notification:", error);
      // Continue execution even if notification creation fails
    }

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

// GET route to fetch a specific offer
export async function GET(
  req: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    const { offerId } = params;
    const offer = await Offer.findById(offerId).populate('jobId');

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check if user is authorized to access this offer
    // Either the offer creator (surgeon) or job creator (patient) should be able to access
    const job = await Job.findById(offer.jobId);
    if (!job) {
      return NextResponse.json({ error: 'Related job not found' }, { status: 404 });
    }

    if (
      offer.createdBy.toString() !== session.user.id &&
      job.createdBy.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to access this offer' },
        { status: 403 }
      );
    }

    return NextResponse.json(offer, { status: 200 });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}