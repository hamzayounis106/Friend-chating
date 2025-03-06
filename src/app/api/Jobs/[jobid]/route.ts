import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobid: string }> }
) {
  const { jobid } = await params; // Change from jobId to jobid
  console.log('received id', jobid);

  await dbConnect();

  try {
    const job = await Job.findById(jobid).populate('patientId').lean().exec();

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
