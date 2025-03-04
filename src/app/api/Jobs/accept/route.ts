import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import dbConnect from '@/lib/db';
import Job from '@/app/models/Job';

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

  let session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  let job;
  try {
    job = await Job.findById(idToAdd);

    if (!job) {
      return new Response('Job not found', { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return new Response('Internal server error', { status: 500 });
  }

  try {
    const surgeonEmailObj = job.surgeonEmails.find(
      (item: { email: string }) => item.email === session?.user?.email
    );

    if (surgeonEmailObj) {
      surgeonEmailObj.status = 'accepted';
      await job.save();
      await pusherServer.trigger(
        toPusherKey(`user:${session?.user?.email}:jobs`),
        'job_accepted',
        job
      );
      return new Response('OK');
    } else {
      return new Response('Unauthorized, you are not invited', { status: 401 });
    }
  } catch (error) {
    console.error('Failed to update job status:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
