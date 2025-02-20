// src/app/api/message/send/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import { Friend } from '@/components/SidebarChatList';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    // The chatId should be in the form "userId1--userId2"
    const [userId1, userId2] = chatId.split('--');
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = session.user.id.toString() === userId1 ? userId2 : userId1;

    const sender = await User.findById(session.user.id.toString()).lean();
    if (!sender) return new Response('Unauthorized', { status: 401 });
    const isFriend = sender.friends.some(
      (friend: Friend) => friend._id.toString() === friendId
    );
    if (!isFriend) return new Response('Unauthorized', { status: 401 });

    // Create the message in MongoDB
    const newMessage = await Message.create({
      sender: session.user.id,
      receiver: friendId,
      content: text,
      timestamp: new Date(),
    });

    // Notify the connected clients using Pusher
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      newMessage
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      'new_message',
      {
        ...newMessage.toObject(),
        senderImg: sender.image,
        senderName: sender.name,
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
