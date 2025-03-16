import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

interface RequestBody {
  amount: number;
  type: string; // 'credit' or 'offer'
  credits?: number; // Only for packages
  title?: string; // Only for packages
  offerId?: string; // Only for offers
  jobId?: string; // Only for offers
  location?: string; // Only for offers
  expectedSurgeryDate?: string; // Only for offers
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const {
      amount,
      type,
      credits,
      title,
      offerId,
      jobId,
      location,
      expectedSurgeryDate,
    } = body;

    // Validate amount
    if (!(amount >= 100)) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be at least $1.' },
        { status: 400 }
      );
    }

    // Prepare metadata based on type
    const metadata: Record<string, string | number> = { type };

    if (type === 'credit') {
      // Add package-specific metadata
      metadata.credits = credits || 0;
      metadata.title = title || 'Package Purchase';
    } else if (type === 'offer') {
      // Add offer-specific metadata
      metadata.offerId = offerId || '';
      metadata.jobId = jobId || '';
      metadata.location = location || '';
      metadata.expectedSurgeryDate = expectedSurgeryDate || '';
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata, // Include metadata
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
