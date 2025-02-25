'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      setValue('email', session.user.email);
      setEmail(session.user.email);
    }
  }, [status, session, setValue]);

  async function sendResetEmail(email: string) {
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/forgot-password', { email });
      toast.success(data.message);
      setEmailSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(formData: ForgotPasswordFormData) {
    setEmail(formData.email);
    await sendResetEmail(formData.email);
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-2xl font-bold mb-4'>Forgot Password</h2>

      {emailSent ? (
        <div className='bg-green-100 border border-green-500 text-green-700 p-4 rounded-md text-center'>
          <p className='font-semibold'>Reset Link Sent!</p>
          <p>A verification link has been sent to your email.</p>
          <p className='text-sm text-gray-600'>
            If not found, please check your spam folder.
          </p>

          {status !== 'authenticated' && (
            <button
              onClick={() => sendResetEmail(email)}
              className='mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
              disabled={loading}
            >
              {loading ? 'Resending...' : 'Resend Email'}
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <input
            type='email'
            placeholder='Your email'
            {...register('email')}
            className='w-full p-2 border rounded-md'
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}

          <button
            type='submit'
            className='w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className='text-gray-600 text-sm text-center'>
            We will send a password reset link to the provided email.
          </p>
        </form>
      )}
    </div>
  );
}
