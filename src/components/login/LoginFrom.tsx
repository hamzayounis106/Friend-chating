'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState, Suspense, FC } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { handleLoginRedirect } from '@/lib/redirect';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: (role?: string) => void; // Accept role as an argument
}

const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResendButton, setShowResendButton] = useState<boolean>(false);
  const [emailToResend, setEmailToResend] = useState<string>('');
  const searchParams = useSearchParams();
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setShowResendButton(false);

    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password.trim(),
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);

        if (result.error.includes('Email not verified')) {
          setShowResendButton(true);
          setEmailToResend(data.email);
        }
        return;
      }

      if (result?.ok) {
        toast.success('Logged in successfully');
        console.log('result for the role ;;🤐🤐🤐🤐', result);
        onSuccess(session?.data?.user?.role); // ✅ Now correctly passed
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!emailToResend) return;

    try {
      const response = await fetch('/api/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToResend }),
      });

      if (response.ok) {
        toast.success('Verification email sent. Please check your inbox.');
        setShowResendButton(false);
      } else {
        toast.error('Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Something went wrong. Try again later.');
    }
  };

  useEffect(() => {
    if (!searchParams) return;

    const params = Object.fromEntries(searchParams.entries());
    if (params?.error === 'OAuthAccountNotLinked') {
      toast.error(
        'Your account is not associated with Google. Please log in with email and password.'
      );

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('error');
      router.replace(`?${newSearchParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 w-full max-w-sm'
    >
      <div className='space-y-2'>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email
        </label>
        <input
          id='email'
          type='email'
          {...register('email')}
          placeholder='Enter your email'
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Password
        </label>
        <input
          id='password'
          type='password'
          {...register('password')}
          placeholder='Enter your password'
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      <button 
        type='submit' 
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className='flex justify-between text-sm'>
        <Link href='/forgot-password' className='text-blue-600 hover:text-blue-800 transition-colors'>
          Forgot Password?
        </Link>
        {showResendButton && (
          <button
            type='button'
            className='text-blue-600 hover:text-blue-800 transition-colors'
            onClick={resendVerificationEmail}
          >
            Resend Verification Email
          </button>
        )}
      </div>
    </form>
  );
};

const Page: FC = () => {
  const router = useRouter();
  const session = useSession();
  const sessionRole = session?.data?.user?.role;
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Login</h1>
      <div className='flex flex-col gap-4'>
        <Suspense fallback={<p>Loading...</p>}>
          <LoginForm
            onSuccess={() => handleLoginRedirect(router, sessionRole)}
          />{' '}
        </Suspense>
      </div>
    </main>
  );
};

export default Page;