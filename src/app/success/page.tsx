// app/success/page.tsx
'use server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';
import CreditPayment from '../models/CreditPayment';
import SuccessPageContent from './SuccessPageContent';

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

  if (status === 'succeeded' && metadata.type === 'credit') {
    await purchaseCredits(
      Number(metadata?.credits),
      amount,
      paymentIntentId,
      metadata?.title
    );
  }

  return (
    <SuccessPageContent
      paymentIntent={JSON.parse(JSON.stringify(paymentIntent))}
    />
  );
}
