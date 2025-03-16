// app/checkout/offer/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePayment } from '@/components/StripePayment';
import { formatCurrency, formatDate } from '@/lib/utils';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function OfferCheckoutContent() {
  const searchParams = useSearchParams();
  const [offerData, setOfferData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // ✅ Move function outside useEffect
  const fetchOfferDetails = async (offerId: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch offer details');
      }
      const data = await response.json();
      console.log('data inside the offer details 😁😁😁😁', data);
      setOfferData(data);
    } catch (error) {
      console.error('Error fetching offer details:', error);
    }
  };

  useEffect(() => {
    const offerParam = searchParams?.get('offer');
    if (offerParam) {
      try {
        fetchOfferDetails(offerParam); // ✅ Now call the function here
      } catch (error) {
        console.error('Error parsing offer data:', error);
      }
    }
  }, [searchParams]);

  const calculateOrderAmount = () => {
    return offerData ? offerData.cost * 100 : 0;
  };

  useEffect(() => {
    async function fetchClientSecret() {
      if (offerData) {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: calculateOrderAmount(),
              type: 'offer',
              offerId: offerData._id,
              jobId: offerData.jobId?._id,
              location: offerData.location,
              expectedSurgeryDate: offerData.date,
            }),
          });

          const result = await response.json();
          setClientSecret(result.clientSecret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
        }
      }
    }

    fetchClientSecret();
  }, [offerData]);

  if (!offerData || !clientSecret) {
    return <div>Loading offer data...</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto'>
        {/* Page Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-extrabold text-gray-900'>Checkout</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Complete your purchase securely
          </p>
        </div>

        {/* Order Summary Card */}
        <div className='bg-white rounded-lg shadow-lg mb-6 overflow-hidden'>
          <div className='px-6 py-4 bg-blue-600 text-white'>
            <h2 className='text-lg font-medium'>Order Summary</h2>
          </div>
          <div className='px-6 py-4'>
            <div className='flex justify-between py-2'>
              <span className='text-gray-600'>Item</span>
              <span className='font-medium'>Surgery Offer</span>
            </div>
            <div className='flex justify-between py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Location</span>
              <span className='font-medium'>{offerData.location}</span>
            </div>
            <div className='flex justify-between py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Expected Surgery Date</span>
              <span className='font-medium'>{formatDate(offerData.date)}</span>
            </div>
            <div className='flex justify-between py-3 text-lg font-bold'>
              <span>Total</span>
              <span>{formatCurrency(calculateOrderAmount() / 100)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form Card */}
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
            <h2 className='text-lg font-medium text-gray-900'>
              Payment Details
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Your payment is secured with SSL encryption
            </p>
          </div>
          <div className='px-6 py-6'>
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: 'stripe' } }}
            >
              <StripePayment
                clientSecret={clientSecret}
                onSuccess={() => console.log('Payment succeeded!')}
                onError={(error) => console.error('Payment error:', error)}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OfferCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OfferCheckoutContent />
    </Suspense>
  );
}
