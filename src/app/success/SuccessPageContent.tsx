// app/success/SuccessPageContent.tsx
'use client';

import { formatDate } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Stripe } from 'stripe';
import { STATUS_CONTENT_MAP } from './statusContentMap';

export default function SuccessPageContent({
  paymentIntent,
}: {
  paymentIntent: Stripe.PaymentIntent;
}) {
  const { status, metadata, amount } = paymentIntent;

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
                      {paymentIntent.id}
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
                  {metadata?.type === 'credit' && (
                    <>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Credits
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.credits}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Title
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.title}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Amount
                        </td>
                        <td className='py-2 text-gray-600'>{amount / 100}$</td>
                      </tr>
                    </>
                  )}
                  {metadata?.type === 'offer' && (
                    <>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Offer ID
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.offerId}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Job ID
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.jobId}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Location
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.location}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Amount{' '}
                        </td>
                        <td className='py-2 text-gray-600'>{amount / 100}$</td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Expected Surgery Date
                        </td>
                        <td className='py-2 text-gray-600'>
                          {formatDate(metadata?.expectedSurgeryDate)}
                        </td>
                      </tr>
                    </>
                  )}
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
