import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Offer from '@/app/models/Offer';
import dbConnect from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { offerId: string } }) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Parse and validate request body
    const { offerId } = params;
    const body = await req.json();
    const { status } = body;

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Update offer status in MongoDB
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    if (!updatedOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOffer, { status: 200 });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}