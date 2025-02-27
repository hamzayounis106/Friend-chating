import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db'; // Import MongoDB connection
import FriendRequest from '@/app/models/Job';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const deletedRequest = await FriendRequest.findOneAndDelete({
      sender: idToDeny.toString(),
      receiver: session.user.id.toString(),
      status: 'pending',
    });

    if (!deletedRequest) {
      return new Response('Friend request not found', { status: 404 });
    }

    return new Response('OK');
  } catch (error) {
    console.log('error deny', error);

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Invalid request', { status: 400 });
  }
}
