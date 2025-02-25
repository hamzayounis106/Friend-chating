'use client';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;
  const [message, setMessage] = useState('Verifying your email...');
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    if (token) {
      axios
        .get(`/api/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
          setIsVerified(true); // Mark as verified
        })
        .catch((error) => {
          console.log('Error in fetching API:', error);
          setMessage(error.response?.data?.message || 'Verification failed.');
        });
    }
  }, [token]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Email Verification</h1>
        <p className={`mb-4 ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>{' '}
        {isVerified && (
          <Link
            href={'/login'}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
          >
            Now You can Login
          </Link>
        )}
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
};

export default VerifyEmailPage;
