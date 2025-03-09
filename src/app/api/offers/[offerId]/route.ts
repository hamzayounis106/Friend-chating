import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import User from '@/app/models/User';
import Job from '@/app/models/Job';
import Surgery from '@/app/models/surgery'; // Import the Surgery model
import Notification from '@/app/models/Notification';
import dbConnect from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

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
    console.log('body', body);
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
    ).populate('jobId');

    if (!updatedOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
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

    // If the offer was accepted, create a surgery in the database
    if (status === 'accepted') {
      try {
        // Create new surgery record
        const newSurgery = new Surgery({
          patientId: job.patientId, // From the job
          surgeonId: updatedOffer.createdBy, // From the offer
          offerId: offerId, // The accepted offer
          jobId: job._id, // The original job
          status: 'scheduled',
          scheduledDate: updatedOffer.date, // Use the date from the offer
        });
        
        // Save the surgery to the database
        await newSurgery.save();
        console.log('Surgery created successfully:', newSurgery._id);
        
        const surgeonEmail = surgeon.email;

        // Update the job with new surgeon statuses and overall job status
        await Job.findByIdAndUpdate(
          job._id, 
          { 
            status: 'scheduled',
            $set: {
              surgeonEmails: job.surgeonEmails.map((surgeon: any) => {
                if (surgeon.email === surgeonEmail) {
                  return { ...surgeon, status: "accepted" };
                } else {
                  return { ...surgeon, status: "declined" };
                }
              })
            }
          }
        );
        
        // Also update any other offers for this job to 'declined'
        await Offer.updateMany(
          { 
            _id: { $ne: offerId },  // Not this offer
            jobId: job._id,         // But for the same job
            status: 'pending'       // That are still pending
          },
          { status: 'declined' }
        );
      } catch (surgeryError) {
        console.error('Error creating surgery:', surgeryError);
        // We'll continue even if surgery creation fails
        // You might want to handle this differently in production
      }
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
        type: 'offer',
      }
    );

    // Create notification in database
    try {
      let notificationMessage = '';
      let notificationType = '';
      
      if (status === 'accepted') {
        notificationMessage = `Your offer for "${job.title}" has been accepted! A surgery has been scheduled.`;
        notificationType = 'offer_accepted';
      } else {
        notificationMessage = `Your offer for "${job.title}" has been declined.`;
        notificationType = 'offer_declined';
      }

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
      console.error('Failed to create notification:', error);
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
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    const { offerId } = await params;
    const offer = await Offer.findById(offerId).populate('jobId');

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Check if user is authorized to access this offer
    // Either the offer creator (surgeon) or job creator (patient) should be able to access
    const job = await Job.findById(offer.jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Related job not found' },
        { status: 404 }
      );
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