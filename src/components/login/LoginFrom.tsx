'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginForminputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForminputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForminputs> = async (data) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password.trim(),
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        toast.success('Logged in successfully');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams!.entries());
    if (params?.error === 'OAuthAccountNotLinked') {
      toast.error(
        'Your account is not associated with Google. Please log in with email and password.'
      );
      // Clear the error query parameter after displaying the toast
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      newSearchParams.delete('error');
      router.replace(`?${newSearchParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full max-w-sm'
    >
      <div className='space-y-2'>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          {...register('email')}
          placeholder='Enter your email'
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          {...register('password')}
          placeholder='Enter your password'
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      <button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div>
        <Link href={'/forgot-password'} className='text-blue-600'>
          Forgot Password
        </Link>
      </div>
    </form>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
