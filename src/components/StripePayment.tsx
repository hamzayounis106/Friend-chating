// components/StripePayment.tsx
'use client';

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';

interface StripePaymentProps {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function StripePayment({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPaymentData = {
      elements,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/success`
          : 'http://localhost:3000/success',
      },
    };

    try {
      const { error } = await stripe.confirmPayment(confirmPaymentData);

      if (error) {
        console.error('Stripe confirmPayment error:', error);
        setErrorMessage(error.message ?? 'An unknown error occurred.');
        onError?.(error.message ?? 'An unknown error occurred.');
      } else {
        setMessage('Payment succeeded!');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error during confirmPayment:', err);
      setMessage('An unexpected error occurred.');
      onError?.('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
    },
  };

  return (
    <form id='payment-form' onSubmit={handleSubmit}>
      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id='submit'
        className={`
          w-full
          px-6
          py-3
          rounded-md
          font-semibold
          text-white
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-colors
          ${
            isLoading || !stripe || !elements
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }
        `}
      >
        <span id='button-text' className='flex items-center justify-center'>
          {isLoading ? (
            <div className='spinner animate-spin rounded-full h-5 w-5 border-2 border-t-blue-50 border-b-blue-50 border-r-blue-50 border-l-white mr-2'></div>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      {message && (
        <div
          id='payment-message'
          className='mt-4 py-3 px-4 bg-red-100 text-red-700 rounded-md text-sm'
          role='alert'
        >
          {message}
        </div>
      )}
      {errorMessage && (
        <div
          id='payment-error-message'
          className='mt-4 py-3 px-4 bg-red-100 text-red-700 rounded-md text-sm'
          role='alert'
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
}
