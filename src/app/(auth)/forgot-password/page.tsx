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
      sendResetEmail(session.user.email);
    }
  }, [status, session, setValue]);

  async function sendResetEmail(email: string) {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/forgot-password', { email });
      toast.success(data.message);
      router.push('/login'); // Redirect after successful request
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(formData: ForgotPasswordFormData) {
    await sendResetEmail(formData.email);
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Forgot Password</h2>
      {status === 'authenticated' ? (
        <p className='text-green-600 font-semibold bg-green-100 border border-green-500 p-2 rounded-md'>
          Reset link has been sent to your email: {session.user?.email}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <input
            type='email'
            placeholder='Your email'
            {...register('email')}
            className='w-full p-2 border'
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}

          <button
            type='submit'
            className='w-full p-2 bg-blue-500 text-white'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}
