import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import dbConnect from '@/lib/db'; // MongoDB connection
import User from '@/app/models/User';
import Job from '@/app/models/Job';
import Notification from '@/app/models/Notification'; // Import the Notification model
import { mailSender, mainClient } from '@/lib/mail';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    const body = await req.json();

    const {
      // title,
      type,
      date,
      description,
      surgeonEmails,
      agreeToTerms,
      createdBy,
      patientId,
      AttachmentUrls,
      location,
      budget,
    } = body;

    // Transform the 'surgeonEmails' array to just include email strings
    const validSurgeonEmails = [];
    for (const emailObj of surgeonEmails) {
      const user = await User.findOne({ email: emailObj.email });

      if (user) {
        if (user.role !== 'patient') {
          validSurgeonEmails.push({
            email: emailObj.email,
            status: emailObj.status,
          });
        } else {
          return new Response(`Email: ${emailObj.email} is not of a surgeon.`, {
            status: 422,
          });
        }
      } else {
        // If the user doesn't exist in the database, still push the email
        validSurgeonEmails.push({
          email: emailObj.email,
          status: emailObj.status,
        });
      }
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (!Array.isArray(AttachmentUrls)) {
      return new Response('Invalid image URLs format', { status: 400 });
    }
    const jobCount = await Job.countDocuments({ type });
    const title = `${type} #${jobCount + 1}`;

    const job = new Job({
      title,
      type,
      date: new Date(date),
      description,
      surgeonEmails: validSurgeonEmails,
      AttachmentUrls:
        Array.isArray(AttachmentUrls) && AttachmentUrls.length > 0
          ? AttachmentUrls
          : [],
      createdBy: session.user.id,
      patientId,
      budget: body.budget || undefined,
      location,
    });

    await job.save();
    console.log('validSurgeonEmails', validSurgeonEmails);
    // Loop through each surgeon email and create notifications
    for (const emailObj of validSurgeonEmails) {
      const surgeon = await User.findOne({ email: emailObj.email });
      console.log('surgeon', surgeon);
      if (surgeon) {
        // Send pusher notification
        await pusherServer.trigger(
          toPusherKey(`surgeon:${emailObj.email}:jobs`),
          'new_job',
          {
            _id: job._id,
            title,
            type,
            date: new Date(date).toISOString(),
            description,
            surgeonEmails: validSurgeonEmails,
            createdBy: session.user.email,
            patientId: session.user.id,
            location,
            AttachmentUrls:
              Array.isArray(AttachmentUrls) && AttachmentUrls.length > 0
                ? AttachmentUrls
                : [],
            budget: body.budget || undefined,
            typeOfNotification: 'job',
          }
        );

        // Create a notification entry in the database
        try {
          console.log(
            'Creating notification for job invite for user:',
            surgeon.email
          );
          const notificationMessage = `You have a new job invitation: ${title}`;

          // Check if a similar notification already exists
          const existingNotification = await Notification.findOne({
            jobId: job._id,
            senderId: session.user.id,
            receiverId: surgeon._id,

            notificationType: 'job_invite',
          });

          if (existingNotification) {
            console.log(
              'Updating existing notification for user:',
              surgeon.email
            );
            // Update the existing notification
            await Notification.findByIdAndUpdate(existingNotification._id, {
              jobId: job._id,
              message: notificationMessage,
              isSeen: false,
            });
          } else {
            console.log('Creating new notification for user:', surgeon.email);
            // Create a new notification
            const newNotification = new Notification({
              jobId: job._id,
              message: notificationMessage,

              isSeen: false,
              senderId: session.user.id,
              receiverId: surgeon._id,
              notificationType: 'job_invite',
            });
            await newNotification.save();
          }
        } catch (error) {
          console.error('Failed to create/update notification:', error);
        }
      }
    }

    return new Response('Job post created successfully', { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      console.error('Mongoose Validation Error:', error.message);
      return new Response(`Database validation failed: ${error.message}`, {
        status: 400,
      });
    }

    // Add CastError handling
    if (error instanceof Error && error.name === 'CastError') {
      console.error('Mongoose Cast Error:', error.message);
      return new Response(`Data type mismatch: ${error.message}`, {
        status: 400,
      });
    }

    return new Response('Error saving job to database', { status: 500 });
  }
}
