import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import * as z from 'zod';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import Job from '@/app/models/Job';
import Notification from '@/app/models/Notification'; // Import Notification model

// Schema validation using Zod
const offerSchema = z.object({
  cost: z.number().min(0, 'Cost cannot be negative'),
  date: z.string().nonempty('Date is required'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters long')
    .max(200, 'Location is too long'),
  description: z.string().nonempty('Description is required'),
  jobId: z.string().nonempty('Job ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const parsedData = offerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Destructure validated data
    const { cost, date, location, jobId, description } = parsedData.data;

    // Create and save offer in MongoDB
    const newOffer = await Offer.create({
      cost,
      date: new Date(date), // Convert date string to Date object
      location,
      jobId,
      description,
      createdBy: session.user.id, // Use authenticated user ID
    });

    const job = await Job.findById(newOffer.jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    const patient = await User.findById(job.patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    console.log(
      'mathc the date format is 😎😎😎😎😎😎😎😎😎',
      newOffer.date.toISOString()
    );
    // Send real-time notification via Pusher
    // console.log('updated offer.createdBy 🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️', updatedOffer.createdBy);
    console.log('Patient idssssssssssss 🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️🚵🏽‍♀️', job?.patientId);
    await pusherServer.trigger(
      toPusherKey(`user:${patient._id}:chats`),
      'notification_toast',
      {
        receiver: patient._id.toString(),
        sender: session.user.id,
        createdBy: session.user.id,
        senderName: session.user.name || 'Surgeon',
        senderImg: session.user.image || '/default.png',
        content: `A new offer has been created for your job ${
          job.title || 'Unknown Job'
        }`,
        timestamp: new Date().toISOString(),
        jobId: job._id.toString(),
        type: 'offer_created',
        cost: newOffer.cost,
        createdAt: newOffer.createdAt,
        description: newOffer.description,
        location: newOffer.location,
        expectedSurgeoryDate: new Date(newOffer.date).toString(),
        status: newOffer.status,
        _id: newOffer._id,
      }
    );
    // Create notification in database
    try {
      const notificationMessage = `A new offer has been created for your job "${
        job.title || 'Unknown Job'
      }"`;
      const newNotification = new Notification({
        message: notificationMessage,
        jobId: job._id,
        isSeen: false,
        senderId: session.user.id,
        receiverId: patient._id,
        notificationType: 'offer_created',
      });
      await newNotification.save();
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Continue execution even if notification creation fails
    }

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
