import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import FriendRequest from '@/app/models/FriendRequest';

export async function POST(req: Request) {
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return new Response('Internal server error', { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return new Response('Invalid JSON', { status: 400 });
  }

  let idToAdd;
  try {
    idToAdd = z.object({ id: z.string() }).parse(body).id;
  } catch (error) {
    console.error('Invalid request payload:', error);
    return new Response('Invalid request payload', { status: 422 });
  }

  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return new Response('Internal server error', { status: 500 });
  }

  let currentUser;
  try {
    currentUser = await User.findById(session.user.id.toString());
    if (currentUser?.friends?.includes(idToAdd)) {
      return new Response('Already friends', { status: 400 });
    }
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return new Response('Internal server error', { status: 500 });
  }

  let hasFriendRequest;
  try {
    hasFriendRequest = await FriendRequest.findOne({
      sender: idToAdd,
      receiver: session.user.id.toString(),
      status: 'pending',
    });
    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 });
    }
  } catch (error) {
    console.error('Error checking friend request:', error);
    return new Response('Internal server error', { status: 500 });
  }

  let user, friend;
  try {
    user = await User.findById(session.user.id.toString());
    friend = await User.findById(idToAdd);
    if (!user || !friend) {
      return new Response('User not found', { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch user or friend:', error);
    return new Response('Internal server error', { status: 500 });
  }

  try {
    user.friends.push(idToAdd);
    friend.friends.push(session.user.id.toString());
    
    // Ensure password field is present (null if missing)
    if (!user.password) user.password = null;
    if (!friend.password) friend.password = null;
    // logs
    await user.save();
    await friend.save();
    hasFriendRequest.status = 'accepted';
    await hasFriendRequest.save();
  } catch (error) {
    console.error('Failed to update friend request and users:', error);
    return new Response('Internal server error', { status: 500 });
  }

  try {
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        'new_friend',
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id.toString()}:friends`),
        'new_friend',
        friend
      ),
    ]);
  } catch (error) {
    console.error('Failed to send Pusher notifications:', error);
  }

  return new Response('OK');
}
