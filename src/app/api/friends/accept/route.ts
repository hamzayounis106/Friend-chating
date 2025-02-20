import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import dbConnect from '@/lib/db'; // Import MongoDB connection
// Import User model
import User from '@/app/models/User';
import FriendRequest from '@/app/models/FriendRequest';

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    // Get the current session

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Check if the users are already friends
    const currentUser = await User.findById(session.user.id.toString());
    const isAlreadyFriends = currentUser.friends.includes(idToAdd);

    if (isAlreadyFriends) {
      return new Response('Already friends', { status: 400 });
    }

    // Check if there's a pending friend request
    const hasFriendRequest = await FriendRequest.findOne({
      sender: idToAdd,
      receiver: session.user.id.toString(),
      status: 'pending',
    });

    if (!hasFriendRequest) {
      return new Response('No friend request', { status: 400 });
    }

    // Fetch both users
    const user = await User.findById(session.user.id.toString());
    const friend = await User.findById(idToAdd);

    if (!user || !friend) {
      return new Response('User not found', { status: 404 });
    }

    // Add each other as friends
    user.friends.push(idToAdd);
    friend.friends.push(session.user.id.toString());

    // Save the updated users
    await user.save();
    await friend.save();

    // Update the friend request status to 'accepted'
    hasFriendRequest.status = 'accepted';
    await hasFriendRequest.save();

    // Notify both users using Pusher
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

    return new Response('OK');
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
