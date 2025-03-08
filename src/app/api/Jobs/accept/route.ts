import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import dbConnect from "@/lib/db";
import Job from "@/app/models/Job";
import Notification from "@/app/models/Notification";

export async function POST(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection failed:", error);
    return new Response("Internal server error", { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return new Response("Invalid JSON", { status: 400 });
  }

  let idToAdd;
  try {
    idToAdd = z.object({ id: z.string() }).parse(body).id;
  } catch (error) {
    console.error("Invalid request payload:", error);
    return new Response("Invalid request payload", { status: 422 });
  }

  let session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let job;
  try {
    job = await Job.findById(idToAdd);

    if (!job) {
      return new Response("Job not found", { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return new Response("Internal server error", { status: 500 });
  }

  try {
    const surgeonEmailObj = job.surgeonEmails.find(
      (item: { email: string }) => item.email === session?.user?.email
    );

    if (surgeonEmailObj) {
      surgeonEmailObj.status = "accepted";
      await job.save();
      // Send a notification using Pusher
      await pusherServer.trigger(
        toPusherKey(`user:${job.createdBy}:chats`),
        "notification_toast",
        {
          receiver: job.createdBy,
          sender: session.user.id,
          senderName: session.user.name || "Patient",
          senderImg: session.user.image || "/default.png",
          content: `Your invite for job ${job.title} has been accepted by ${session.user.name}`,
          timestamp: new Date().toISOString(),
          jobId: job._id.toString(),
          type: "invite_accepted",
        }
      );
      // await pusherServer.trigger(
      //   toPusherKey(`user:${session?.user?.email}:jobs`),
      //   'notification_toast',
      //   job
      // );
      // / Store the notification in the database
      try {
        const notificationMessage = `Your invite for job "${job.title}" has been accepted by ${session.user.name}`;
        const notificationLink = `/dashboard/jobs/${job._id}`;
        
        // Check if a similar notification already exists
        const existingNotification = await Notification.findOne({
          jobId: job._id,
          senderId: session.user.id,
          receiverId: job.createdBy,
  
          notificationType: 'job_acceptance',
        });

        if (existingNotification) {
          // Update the existing notification
          await Notification.findByIdAndUpdate(existingNotification._id, {
            message: notificationMessage,
            isSeen: false,
            updatedAt: new Date()
          });
        } else {
          // Create a new notification
          const newNotification = new Notification({
            jobId: job._id,
            message: notificationMessage,
         
            isSeen: false,
            senderId: session.user.id,
            receiverId: job.createdBy,
            notificationType: 'job_acceptance',
          });
          await newNotification.save();
        }
      } catch (error) {
        console.error("Failed to create/update notification:", error);
        // Continue execution even if notification creation fails
      }
      return new Response(
        JSON.stringify({
          status: 200,
          job: job,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response("Unauthorized, you are not invited", { status: 401 });
    }
  } catch (error) {
    console.error("Failed to update job status:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
