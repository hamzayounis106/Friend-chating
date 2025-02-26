'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Zod schema for validation
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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

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
    <div className='max-w-md mx-auto p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-2xl font-bold mb-4'>Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <input
            type='password'
            placeholder='New password'
            {...register('password')}
            className='w-full p-2 border rounded-md'
          />
          {errors.password && (
            <p className='text-red-500 text-sm'>{errors.password.message}</p>
          )}
        </div>
        <div>
          <input
            type='password'
            placeholder='Confirm new password'
            {...register('confirmPassword')}
            className='w-full p-2 border rounded-md'
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type='submit'
          className='w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
