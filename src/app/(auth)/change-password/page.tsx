'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/button';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token');
      router.push('/login');
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(formData: ResetPasswordFormData) {
    try {
      const { data } = await axios.post('/api/change-password', {
        token,
        newPassword: formData.password,
      });

      toast.success(data.message);
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-md'>
        <div className='flex flex-col items-center mb-6'>
          <h2 className='text-2xl font-bold text-center'>Reset Password</h2>
          <p className='text-gray-600 text-sm mt-1'>
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='password'>New Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter new password'
                {...register('password')}
                className={`pr-10 ${
                  errors.password
                    ? 'focus:border-red-500 focus:ring-red-500 '
                    : ''
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                {...register('confirmPassword')}
                className={`pr-10 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm text-red-500'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPassword />
    </Suspense>
  );
}
