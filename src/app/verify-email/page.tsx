'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      axios
        .get(`/api/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
        })
        .catch((error) => {
          console.log('Error in fetching API:', error);
          setMessage(error.response?.data?.message || 'Verification failed.');
        });
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;