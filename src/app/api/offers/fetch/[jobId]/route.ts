import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Offer from '@/app/models/Offer';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await dbConnect();

    // Get the jobId from the route parameters
    const { jobId } = await params;
    console.log('Fetching offers foradfs afsdfasdf dfdfsdafasdf job:', jobId);
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    // Get the user's session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all offers for this job
    const offers = await Offer.find({
      jobId: new mongoose.Types.ObjectId(jobId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}
