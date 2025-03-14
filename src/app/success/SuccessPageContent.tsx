// app/success/SuccessPageContent.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { Stripe } from 'stripe';
import { STATUS_CONTENT_MAP } from './statusContentMap';

export default function SuccessPageContent({
  paymentIntent,
}: {
  paymentIntent: Stripe.PaymentIntent;
}) {
  const searchParams = useSearchParams();

  // Handle the case where searchParams is null
  if (!searchParams) {
    return <div>Loading...</div>; // Or any other fallback UI
  }

  const paymentIntentId = searchParams.get('payment_intent');

  // Handle the case where paymentIntentId is missing
  if (!paymentIntentId) {
    return <div>Invalid payment intent.</div>; // Or redirect to a fallback page
  }

  const { status, metadata } = paymentIntent;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-xl p-6'>
        <div className='text-center'>
          <div
            className='inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full'
            style={{
              backgroundColor: STATUS_CONTENT_MAP[status]?.iconColor,
            }}
          >
            {STATUS_CONTENT_MAP[status]?.icon}
          </div>
          <h2 className='text-2xl font-semibold text-gray-800'>
            {STATUS_CONTENT_MAP[status]?.text}
          </h2>
        </div>

        {paymentIntent && (
          <div className='mt-4'>
            <div className='bg-gray-50 rounded-md p-4'>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b border-gray-200'>
                    <td className='py-2 font-medium text-gray-700'>
                      Payment ID
                    </td>
                    <td className='py-2 text-gray-600 break-all'>
                      {paymentIntentId}
                    </td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Status</td>
                    <td className='py-2 text-gray-600'>{status}</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Type</td>
                    <td className='py-2 text-gray-600'>{metadata?.type}</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Credits</td>
                    <td className='py-2 text-gray-600'>{metadata?.credits}</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Title</td>
                    <td className='py-2 text-gray-600'>{metadata?.title}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className='mt-6 flex flex-col space-y-3'>
          <a
            href='/'
            className='block text-center py-3 px-4 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
          >
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
