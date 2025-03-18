import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Job from '@/app/models/Job';
import User from '@/app/models/User';
import { authOptions } from '@/lib/auth';
import { SurgeonEmail } from '@/types/surgeon';
export async function POST(request: Request) {
  try {
    await dbConnect();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error('No authenticated user');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { id, currentUserEmail } = body;

    if (!id || !currentUserEmail) {
      console.error('Missing id or currentUserEmail');
      return NextResponse.json(
        { error: 'Missing id or currentUserEmail' },
        { status: 400 }
      );
    }

    const job = await Job.findById(id);

    if (!job) {
      console.error('No job found for this ID');
      return NextResponse.json(
        { error: 'No job found for this ID' },
        { status: 404 }
      );
    }

    // Find the user with the provided email
    const surgeon = await User.findOne({ email: currentUserEmail })
      .lean()
      .exec();

    if (!surgeon) {
      console.error('No user found with this email');
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      );
    }

    // Check if surgeon is already in the surgeonEmails array
    const alreadyInvited = job.surgeonEmails.some(
      (surgeon: SurgeonEmail) => surgeon.email === currentUserEmail
    );

    if (alreadyInvited) {
      return NextResponse.json(
        { error: 'Surgeon already invited' },
        { status: 400 }
      );
    }

    // Add the surgeon to the job's surgeonEmails
    job.surgeonEmails.push({
      email: currentUserEmail,
      status: 'pending',
    });

    await job.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invite:', error);
    return NextResponse.json(
      { error: 'Failed to send invite' },
      { status: 500 }
    );
  }
}
