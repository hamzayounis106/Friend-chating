import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { addFriendValidator } from '@/lib/validations/add-friend';
import dbConnect from '@/lib/db'; // Import MongoDB connection
import User from '@/app/models/User';
import FriendRequest from '@/app/models/FriendRequest';

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse and validate the request body
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body);

    // Find the user to add by email
    const userToAdd = await User.findOne({ email: emailToAdd });
    if (!userToAdd) {
      return new Response('This person does not exist.', { status: 400 });
    }

    // Get the current session
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Check if the user is trying to add themselves
    if (userToAdd._id.toString() === session.user.id.toString()) {
      return new Response('You cannot add yourself as a friend', {
        status: 400,
      });
    }

    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: session.user.id.toString(),
      receiver: userToAdd._id.toString(),
    });

    if (existingRequest) {
      return new Response('Already added this user', { status: 400 });
    }

    // Check if the users are already friends
    const currentUser = await User.findById(session.user.id.toString());
    if (currentUser.friends.includes(userToAdd._id.toString())) {
      return new Response('Already friends with this user', { status: 400 });
    }

    // Create a new friend request
    const friendRequest = new FriendRequest({
      sender: session.user.id.toString(),
      receiver: userToAdd._id.toString(),
      status: 'pending',
    });

    await friendRequest.save();

    // Notify the user using Pusher
    await pusherServer.trigger(
      toPusherKey(`user:${userToAdd._id.toString()}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id.toString(),
        senderEmail: session.user.email,
      }
    );

    return new Response('OK');
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
