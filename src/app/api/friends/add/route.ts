import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Body', body);

    // Validate the entire body object
    const { email: emailToAdd } = addFriendValidator.parse(body);
    console.log('Validated Email:', emailToAdd);

    const idToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string;
    console.log('ID to Add:', idToAdd);

    if (!idToAdd) {
      console.log('User does not exist');
      return new Response('This person does not exist.', { status: 400 });
    }

    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session) {
      console.log('Unauthorized');
      return new Response('Unauthorized', { status: 401 });
    }

    if (idToAdd === session.user.id) {
      console.log('Cannot add yourself');
      return new Response('You cannot add yourself as a friend', {
        status: 400,
      });
    }

    // Check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    console.log('Is Already Added:', isAlreadyAdded);

    if (isAlreadyAdded) {
      console.log('Already added this user');
      return new Response('Already added this user', { status: 400 });
    }

    // Check if user is already friends
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    console.log('Is Already Friends:', isAlreadyFriends);

    if (isAlreadyFriends) {
      console.log('Already friends with this user');
      return new Response('Already friends with this user', { status: 400 });
    }

    // Valid request, send friend request
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    console.log('Friend request sent');

    return new Response('OK');
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}