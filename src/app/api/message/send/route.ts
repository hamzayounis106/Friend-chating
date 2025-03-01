// src/app/api/message/send/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import mongoose from 'mongoose';
import Job from '@/app/models/Job';

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
    if (!session) return new Response('Unauthorized', { status: 401 });

    // The chatId should be in the form "userId1--userId2"
    const [userId1, userId2, jobId] = chatId.split('--');
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = session.user.id.toString() === userId1 ? userId2 : userId1;

    // Fetch the sender document and cast it as a LeanUser
    const senderDoc = await User.findById(session.user.id.toString()).lean();
    if (!senderDoc) return new Response('Unauthorized', { status: 401 });
    const sender = senderDoc as unknown as LeanUser;
    // const isInvited = sender.friends.some(
    //   (friend: LeanFriend) => friend._id.toString() === friendId
    // );
    const userEmail = session?.user.email;
    const job = await Job.findById(jobId);
    const data = job?.toObject();
    const isContainEmail = data?.surgeonEmails.some(
      (item) => item.email === userEmail && item.status === 'accepted'
    );

    // const isContainEmailForPatient = data?.createdBy === userEmail;
    const isContainCreatedIdForPatient = data?.createdBy === session.user.id;

    if (!isContainEmail && session.user.role === 'surgeon')
      return new Response('Unauthorized', { status: 401 });
    if (!isContainCreatedIdForPatient && session.user.id === 'patient')
      return new Response('Unauthorized', { status: 401 });
    const newMessage = await Message.create({
      sender: session.user.id,
      receiver: friendId,
      content: text,
      jobId: jobId?.toString(),
      timestamp: new Date(),
    });

    await pusherServer.trigger(
      toPusherKey(`user:${`${friendId}--${jobId}`}:chats`),
      'new_message',
      {
        ...newMessage.toObject(),
        senderImg: sender.image,
        senderName: sender.name,
        jobId,
      }
    );

    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
