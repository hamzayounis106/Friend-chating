// app/success/SuccessPageContent.tsx
'use client';

import { formatDate } from '@/lib/utils';
import { Stripe } from 'stripe';
import { STATUS_CONTENT_MAP } from './statusContentMap';

export default function SuccessPageContent({
  paymentIntent,
}: {
  paymentIntent: Stripe.PaymentIntent;
}) {
  const { status, metadata, amount } = paymentIntent;
  const isOffer = metadata?.type === 'offer';
  const isCredit = metadata?.type === 'credit';

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
          <p className='mt-2 text-gray-600'>
            {isOffer
              ? 'Your surgery booking is confirmed!'
              : 'Payment processed successfully'}
          </p>
        </div>

        {paymentIntent && (
          <div className='mt-4'>
            <div className='bg-gray-50 rounded-md p-4'>
              <table className='w-full'>
                <tbody>
                  <tr className='border-b border-gray-200'>
                    <td className='py-2 font-medium text-gray-700'>
                      Transaction ID
                    </td>
                    <td className='py-2 text-gray-600 break-all'>
                      {paymentIntent.id}
                    </td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Status</td>
                    <td className='py-2 text-gray-600 capitalize'>{status}</td>
                  </tr>
                  <tr>
                    <td className='py-2 font-medium text-gray-700'>Type</td>
                    <td className='py-2 text-gray-600 capitalize'>
                      {metadata?.type}
                    </td>
                  </tr>

                  {isCredit && (
                    <>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Credits Added
                        </td>
                        <td className='py-2 text-gray-600'>
                          {metadata?.credits}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Amount
                        </td>
                        <td className='py-2 text-gray-600'>
                          ${(amount / 100).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  )}

                  {isOffer && (
                    <>
                      <tr>
                        <td className='py-2 font-medium text-gray-700'>
                          Surgery Date
                        </td>
                        <td className='py-2 text-gray-600'>
                          {formatDate(metadata?.expectedSurgeryDate)}
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
                          Total Amount
                        </td>
                        <td className='py-2 text-gray-600'>
                          ${(amount / 100).toFixed(2)}
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
            href={isOffer ? '/dashboard/surgeries' : '/dashboard'}
            className={`block text-center py-3 px-4 rounded-md ${
              isOffer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            } transition-colors duration-200`}
          >
            {isOffer ? 'View My Surgeries' : 'Go to Dashboard'}
          </a>

          {isCredit && (
            <a
              href='/dashboard'
              className='block text-center py-3 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200'
            >
              Check My Credits
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
