// src/app/api/message/send/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import User from "@/app/models/User";
import Message from "@/app/models/Message";
import mongoose from "mongoose";
import Job from "@/app/models/Job";
import type { SurgeonEmail } from "@/types/surgeon";
import Notification from "@/app/models/Notification";

// Define a lean type for a friend (as stored in the User model)
interface LeanFriend {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  image?: string;
}

// Define a lean type for a user, including the friends property
interface LeanUser {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  friends: LeanFriend[];
}

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    // The chatId should be in the form "userId1--userId2"
    const [userId1, userId2, jobId] = chatId.split("--");
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id.toString() === userId1 ? userId2 : userId1;
    // Fetch the sender document and cast it as a LeanUser
    const senderDoc = await User.findById(session.user.id.toString()).lean();
    if (!senderDoc) return new Response("Unauthorized", { status: 401 });
    const sender = senderDoc as unknown as LeanUser;

    const userEmail = session?.user.email;
    const job = await Job.findById(jobId);
    const data = job?.toObject();
    const isContainEmail = data?.surgeonEmails.some(
      (item: SurgeonEmail) =>
        item.email === userEmail && item.status === "accepted"
    );

    // const isContainEmailForPatient = data?.createdBy === userEmail;
    const isContainCreatedIdForPatient = data?.createdBy === session.user.id;

    if (!isContainEmail && session.user.role === "surgeon")
      return new Response("Unauthorized", { status: 401 });
    if (!isContainCreatedIdForPatient && session.user.id === "patient")
      return new Response("Unauthorized", { status: 401 });
    const newMessage = await Message.create({
      sender: session.user.id,
      receiver: friendId,
      content: text,
      jobId: jobId?.toString(),
      timestamp: new Date().toISOString(),
    });
    // let alreadyNotification;
    // try {
    //   alreadyNotification = await Notification.findOne({
    //     senderId: session.user.id,
    //     receiverId: friendId,
    // link: `/dashboard/chat/${chatId}`,
    //   });
    // } catch (error) {
    //   console.error("Failed to fetch notification:", error);
    //   return new Response("Internal server error", { status: 500 });
    // }

    // if (alreadyNotification) {
    //   console.log("Already notification found=============");
    //   try {
    //     await Notification.findOneAndUpdate(
    //       {
    //         senderId: session.user.id,
    //         receiverId: friendId,
    //         link: `/dashboard/chat/${chatId}`,
    //       },
    //       { message: text,isSeen: false }
    //     );
    //   } catch (error) {
    //     console.error("Failed to update notification:", error);
    //     return new Response("Internal server error", { status: 500 });
    //   }
    // } else {
    //   try {
    //     const newNotification = await Notification.create({
    //       message: text,
    //       link: `/dashboard/chat/${chatId}`,
    //       isSeen: false,
    //       senderId: session.user.id,
    //       receiverId: friendId,
   
    //       notificationType: "send_message",
    
    //     });
    //     await newNotification.save();
    //   } catch (error) {
    //     console.error("Failed to create notification:", error);
    //     return new Response("Internal server error", { status: 500 });
    //   }
    // }
    //  check for the pusher is working or not on message send or recieve
    // console.log('🔥 Triggering Pusher event...');
    // console.log('Channel:', toPusherKey(`user:${`${friendId}`}:chats`));
    // console.log('Payload:', {
    //   ...newMessage.toObject(),
    //   senderImg: sender.image,
    //   senderName: sender.name,
    //   jobId,
    // });

    await pusherServer.trigger(
      toPusherKey(`user:${`${friendId}--${jobId}`}:chats`),
      "new_message",
      {
        ...newMessage.toObject(),
        senderImg: sender.image,
        senderName: sender.name,
        jobId,
      }
    );
    await pusherServer.trigger(
      toPusherKey(`user:${`${friendId}`}:chats`),
      "notification_toast",
      {
        ...newMessage.toObject(),
        senderImg: sender.image,
        senderName: sender.name,
        jobId,
      }
    );
    return new Response(JSON.stringify(newMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
