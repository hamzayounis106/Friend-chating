import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Job from '@/app/models/Job';
import Offer from '@/app/models/Offer';
import mongoose from 'mongoose';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobid: string }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { jobid } = await params;
    console.log('job id is commming in the patch request ', jobid);

    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Validate job ID
    if (!jobid || !mongoose.Types.ObjectId.isValid(jobid)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    // Find the job
    const job = await Job.findById(jobid);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if the user is the creator of the job
    if (job.patientId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to close this job' },
        { status: 403 }
      );
    }

    // Check if job is already closed
    if (job.status === 'completed' || job.status === 'closed') {
      return NextResponse.json(
        { error: 'Job is already closed' },
        { status: 400 }
      );
    }

    // Check if job is scheduled - don't close if scheduled
    if (job.status === 'scheduled') {
      return NextResponse.json(
        { error: 'Cannot close a scheduled job Your Job is Already Secuduled' },
        { status: 400 }
      );
    }

    // Begin a MongoDB session for transaction
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      // Update job status to closed
      job.status = 'closed';
      await job.save({ session: mongoSession });

      // Cancel all pending offers for this job
      await Offer.updateMany(
        {
          jobId: job._id,
          status: 'pending',
        },
        {
          status: 'declined',
          updatedAt: new Date(),
        },
        { session: mongoSession }
      );

      // Commit the transaction
      await mongoSession.commitTransaction();
      mongoSession.endSession();

      return NextResponse.json(
        { message: 'Job closed successfully' },
        { status: 200 }
      );
    } catch (error) {
      // Abort transaction on error
      await mongoSession.abortTransaction();
      mongoSession.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error closing job:', error);
    return NextResponse.json({ error: 'Failed to close job' }, { status: 500 });
  }
}
