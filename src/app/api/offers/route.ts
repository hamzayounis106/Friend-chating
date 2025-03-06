import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import * as z from 'zod';
import dbConnect from '@/lib/db';

// Schema validation using Zod
const offerSchema = z.object({
  cost: z.number().min(0, 'Cost cannot be negative'),
  date: z.string().nonempty('Date is required'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters long')
    .max(200, 'Location is too long'),
  jobId: z.string().nonempty('Job ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const parsedData = offerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Destructure validated data
    const { cost, date, location, jobId } = parsedData.data;

    // Create and save offer in MongoDB
    const newOffer = await Offer.create({
      cost,
      date: new Date(date), // Convert date string to Date object
      location,
      jobId,
      createdBy: session.user.id, // Use authenticated user ID
    });

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
