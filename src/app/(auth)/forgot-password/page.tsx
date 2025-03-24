'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, RefreshCw, Rocket } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

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

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>Forgot Password</h2>

        {emailSent ? (
          <div className='bg-green-50 border border-green-200 rounded-lg p-6 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4'>
              <Rocket className='text-green-600 h-6 w-6' />
            </div>
            <h3 className='text-lg font-medium text-green-800 mb-2'>
              Reset Link Sent!
            </h3>
            <p className='text-green-700 mb-3'>
              A password reset link has been launched to your email inbox.
            </p>
            <p className='text-sm text-green-600 mb-4'>
              Can&apos;t find it? Check your spam folder—it might have landed
              there.
            </p>

            {status !== 'authenticated' && (
              <Button
                onClick={() => sendResetEmail(email)}
                className='w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 transition-colors'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Resend Email
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Input
                  id='email'
                  type='email'
                  placeholder='Your email address'
                  {...register('email')}
                  className={`pr-10 ${errors.email ? 'border-red-500' : ''}`}
                />
                <ArrowRight className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              </div>
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <p className='text-gray-600 text-sm text-center'>
              We&apos;ll send a password reset link to your email
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
