import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db'; // Import MongoDB connection
import FriendRequest from '@/models/FriendRequest'; // Import FriendRequest model

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Find and delete the friend request
    const deletedRequest = await FriendRequest.findOneAndDelete({
      sender: idToDeny,
      receiver: session.user.id,
      status: 'pending',
    });

    if (!deletedRequest) {
      return new Response('Friend request not found', { status: 404 });
    }

    return new Response('OK');
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}