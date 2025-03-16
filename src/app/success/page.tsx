'use server';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';
import CreditPayment from '../models/CreditPayment';
import SuccessPageContent from './SuccessPageContent';

// Define the OfferMetadata interface
interface OfferMetadata {
  expectedSurgeryDate: string;
  jobId: string;
  location: string;
  offerId: string;
  type: string;
}

// Type guard to validate metadata
function isOfferMetadata(metadata: any): metadata is OfferMetadata {
  return (
    typeof metadata === 'object' &&
    metadata !== null &&
    typeof metadata.expectedSurgeryDate === 'string' &&
    typeof metadata.jobId === 'string' &&
    typeof metadata.location === 'string' &&
    typeof metadata.offerId === 'string' &&
    typeof metadata.type === 'string'
  );
}

async function purchaseCredits(
  quantity: number,
  amount: number,
  paymentIntentId: string,
  title: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error('No session found');
    return;
  }

  const existingPayment = await CreditPayment.findOne({ paymentIntentId });
  if (existingPayment) {
    console.log('Payment already processed');
    return;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const absoluteUrl = `${baseUrl}/api/credit`;
    const cookieHeader = cookies().toString();

    const response = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      body: JSON.stringify({ quantity, paymentIntentId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to purchase credits');
    }

    const creditPayment = new CreditPayment({
      paymentIntentId,
      patientId: session.user.id,
      status: 'succeeded',
      metadata: {
        type: 'credit',
        credits: quantity,
        title: title,
        amount: amount / 100,
      },
    });
    await creditPayment.save();

    console.log('Credits purchased successfully:', data);
  } catch (error) {
    console.error('Error purchasing credits:', error);
  }
}

async function acceptOffer(
  paymentIntentId: string,
  amount: number,
  metadata: OfferMetadata
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error('No session found');
    return;
  }

  console.log('metadata 😋😋😋😋😋', metadata);
  const existingPayment = await CreditPayment.findOne({ paymentIntentId });
  if (existingPayment) {
    console.log('Payment already processed');
    return;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const absoluteUrl = `${baseUrl}/api/offers/${metadata.offerId}`;
    const cookieHeader = cookies().toString();

    const response = await fetch(absoluteUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      body: JSON.stringify({ status: 'accepted', paymentIntentId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to accept offer');
    }

    const creditPayment = new CreditPayment({
      paymentIntentId,
      patientId: session.user.id, // Assuming the patient is the logged-in user
      status: 'succeeded',
      metadata: {
        type: 'offer',
        amount: amount / 100, // Convert amount to dollars
        offerId: metadata.offerId,
        jobId: metadata.jobId,
        location: metadata.location,
        expectedSurgeryDate: metadata.expectedSurgeryDate,
      },
    });

    await creditPayment.save();

    console.log('Offer accepted successfully:', data);
  } catch (error) {
    console.error('Error accepting offer:', error);
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string }>;
}) {
  const { payment_intent: paymentIntentId } = await searchParams;

  if (!paymentIntentId) redirect('/');

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent) redirect('/');

  const { status, metadata, amount } = paymentIntent;

  if (status === 'succeeded') {
    if (metadata.type === 'credit') {
      await purchaseCredits(
        Number(metadata.credits),
        amount,
        paymentIntentId,
        metadata.title
      );
    } else if (metadata.type === 'offer') {
      if (isOfferMetadata(metadata)) {
        await acceptOffer(paymentIntentId, amount, metadata);
      } else {
        console.error('Invalid metadata structure for offer');
      }
    }
  }

  return (
    <SuccessPageContent
      paymentIntent={JSON.parse(JSON.stringify(paymentIntent))}
    />
  );
}
