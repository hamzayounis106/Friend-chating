// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
//   Elements,
// } from '@stripe/react-stripe-js';
// import {
//   Appearance,
//   loadStripe,
//   StripePaymentElementOptions,
// } from '@stripe/stripe-js';
// import { useSearchParams } from 'next/navigation';
// import { packages } from '@/lib/packages';

// // Make sure to call loadStripe outside of a component’s render to avoid
// // recreating the Stripe object on every render.
// // This is your test publishable API key.
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );

// interface PaymentFormProps {
//   amount: number;
//   type: string;
// }

// function PaymentForm({ amount, type }: PaymentFormProps) {
//   const stripe = useStripe();
//   const elements = useElements();
//   console.log('typed confirmPaymentData', type);

//   const [message, setMessage] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     setIsLoading(true);

//     let confirmPaymentData = {
//       elements,
//       confirmParams: {
//         return_url: process.env.NEXT_PUBLIC_BASE_URL
//           ? `${process.env.NEXT_PUBLIC_BASE_URL}/success`
//           : 'http://localhost:3000/success', // Fallback for local dev
//       },
//     };

//     if (type === 'credit') {
//       console.log('Processing credit purchase');
//     } else if (type === 'offer') {
//       console.log('Processing offer purchase');
//     }

//     try {
//       const { error } = await stripe.confirmPayment(confirmPaymentData);

//       if (error) {
//         console.error('Stripe confirmPayment error:', error);
//         setErrorMessage(error.message ?? 'An unknown error occurred.');
//       } else {
//         // Payment succeeded!
//         console.log('Payment succeeded!');
//         setMessage('Payment succeeded!');
//       }
//     } catch (err) {
//       console.error('Error during confirmPayment:', err);
//       setMessage('An unexpected error occurred.');
//     }

//     setIsLoading(false);
//   };

//   const paymentElementOptions: StripePaymentElementOptions = {
//     layout: {
//       type: 'tabs',
//     },
//   };

//   return (
//     <form id='payment-form' onSubmit={handleSubmit}>
//       <PaymentElement id='payment-element' options={paymentElementOptions} />
//       <button
//         disabled={isLoading || !stripe || !elements}
//         id='submit'
//         className={`
//           w-full
//           px-6
//           py-3
//           rounded-md
//           font-semibold
//           text-white
//           focus:outline-none focus:ring-2 focus:ring-offset-2
//           transition-colors
//           ${
//             isLoading || !stripe || !elements
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
//           }
//         `}
//       >
//         <span id='button-text' className='flex items-center justify-center'>
//           {isLoading ? (
//             <div className='spinner animate-spin rounded-full h-5 w-5 border-2 border-t-blue-50 border-b-blue-50 border-r-blue-50 border-l-white mr-2'></div>
//           ) : (
//             'Pay now'
//           )}
//         </span>
//       </button>
//       {/* Show any error or success messages */}
//       {message && (
//         <div
//           id='payment-message'
//           className='mt-4 py-3 px-4 bg-red-100 text-red-700 rounded-md text-sm'
//           role='alert'
//         >
//           {message}
//         </div>
//       )}
//       {errorMessage && (
//         <div
//           id='payment-error-message'
//           className='mt-4 py-3 px-4 bg-red-100 text-red-700 rounded-md text-sm'
//           role='alert'
//         >
//           {errorMessage}
//         </div>
//       )}
//     </form>
//   );
// }

// interface CheckoutFormProps {
//   clientSecret: string;
// }

// export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
//   const appearance: Appearance = {
//     theme: 'stripe',
//   };

//   const searchParams = useSearchParams();

//   // Convert all query parameters into an object
//   const queryParams: Record<string, string> = {};
//   searchParams?.forEach((value, key) => {
//     queryParams[key] = value;
//   });

//   // Decode and safely parse the "package" parameter
//   const [packageData, setPackageData] = useState<any>(null);

//   useEffect(() => {
//     if (queryParams?.package) {
//       try {
//         // First, replace any erroneous double encoding
//         const fixedJsonString = queryParams.package.replace(/%22/g, '"');

//         // Attempt to parse JSON safely
//         const parsedPackageData = JSON.parse(fixedJsonString);
//         setPackageData(parsedPackageData);
//       } catch (error) {
//         console.error('Error parsing package JSON:', error);
//       }
//     }
//   }, [queryParams.package]);

//   const FilterDataParams = packages.find(
//     (p) => p.title.toLowerCase() === packageData?.title.toLowerCase()
//   );

//   console.log('data to gilter in the from ', FilterDataParams);
//   return (
//     <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
//       {FilterDataParams && (
//         <PaymentForm amount={FilterDataParams?.price} type={'credit'} />
//       )}
//     </Elements>
//   );
// }

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import {
  Appearance,
  loadStripe,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import { packages, PackageType } from '@/lib/packages';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  amount: number;
  type: string;
}

function PaymentForm({ amount, type }: PaymentFormProps) {
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
      } else {
        setMessage('Payment succeeded!');
      }
    } catch (err) {
      console.error('Error during confirmPayment:', err);
      setMessage('An unexpected error occurred.');
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

interface CheckoutFormProps {
  clientSecret: string;
}

function CheckoutFormContent({ clientSecret }: CheckoutFormProps) {
  const searchParams = useSearchParams();

  // Convert all query parameters into an object
  const queryParams: Record<string, string> = {};
  searchParams?.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Decode and safely parse the "package" parameter
  const [packageData, setPackageData] = useState<PackageType | null>(null);

  useEffect(() => {
    if (queryParams?.package) {
      try {
        const fixedJsonString = queryParams.package.replace(/%22/g, '"');
        const parsedPackageData = JSON.parse(fixedJsonString);
        setPackageData(parsedPackageData);
      } catch (error) {
        console.error('Error parsing package JSON:', error);
      }
    }
  }, [queryParams.package]);

  const FilterDataParams = packages.find(
    (p) => p.title.toLowerCase() === packageData?.title.toLowerCase()
  );

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      {FilterDataParams && (
        <PaymentForm amount={FilterDataParams.price} type='credit' />
      )}
    </Elements>
  );
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutFormContent clientSecret={clientSecret} />
    </Suspense>
  );
}
