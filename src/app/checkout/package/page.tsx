// app/checkout/package/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripePayment } from '@/components/StripePayment';
import { packages, PackageType } from '@/lib/packages';
import { formatCurrency } from '@/lib/utils';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PackageCheckoutContent() {
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<PackageType | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const packageParam = searchParams?.get('package');
    if (packageParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(packageParam));
        const filterDataParams = packages.find(
          (p) => p.title.toLowerCase() === parsedData.title.toLowerCase()
        );

        if (filterDataParams) {
          setPackageData(filterDataParams);
        }
      } catch (error) {
        console.error('Error parsing package data:', error);
      }
    }
  }, [searchParams]);

  const calculateOrderAmount = () => {
    return packageData ? packageData.price * 100 : 0;
  };

  useEffect(() => {
    async function fetchClientSecret() {
      if (packageData) {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: calculateOrderAmount(),
              type: 'credit',
              credits: packageData.credits,
              title: packageData.title,
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
  }, [packageData]);

  if (!packageData || !clientSecret) {
    return <div>Loading package data...</div>;
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
              <span className='font-medium'>{packageData.title}</span>
            </div>
            <div className='flex justify-between py-2 border-b border-gray-200'>
              <span className='text-gray-600'>Quantity</span>
              <span className='font-medium'>{packageData.credits}</span>
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

export default function PackageCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PackageCheckoutContent />
    </Suspense>
  );
}
