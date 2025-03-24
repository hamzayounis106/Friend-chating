'use client';

import Button from '@/components/custom-ui/Button';
import SignupForm from '@/components/signup/SignupForm';
import { handleLoginRedirect } from '@/lib/redirect';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const sessionRole = session?.data?.user?.role;
  async function loginWithGoogle() {
    setIsLoading(true);
    try {
      const result = await signIn('google');
      if (result?.error) {
        toast.error('Something went wrong with your login.');
      }
    } catch (error) {
      toast.error('Something went wrong with your login.');
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (session.status === 'authenticated') {
      handleLoginRedirect(router, sessionRole);
    }
  }, [session, sessionRole, router]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex flex-col lg:flex-row h-full'>
        {/* Left side - Image (hidden on mobile) */}
        <div className='hidden lg:block lg:w-1/2 bg-primary relative'>
          <div className='absolute inset-0 flex items-center justify-center p-12'>
            <div className='text-white text-center max-w-md'>
              <div className='w-32 h-32 mx-auto mb-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-16 w-16 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
              </div>
              <h2 className='text-4xl font-bold mb-4'>Join Our Community</h2>
              <p className='text-xl opacity-90'>
                Create your account to unlock personalized features and start
                your journey.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md'>
            <div className='flex flex-col items-center gap-6 lg:hidden'>
              <div className='w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-12 w-12'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
              </div>
              <h2 className='text-center text-3xl font-extrabold text-gray-900'>
                Sign Up{' '}
              </h2>
            </div>

            <SignupForm />
            <div className='relative w-full'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              isLoading={isLoading}
              type='button'
              className='max-w-sm mx-auto w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              onClick={loginWithGoogle}
            >
              {isLoading ? null : (
                <svg
                  className='mr-2 h-5 w-5'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='github'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                  <path d='M1 1h22v22H1z' fill='none' />
                </svg>
              )}
              Sign Up with Google
            </Button>

            <div className='text-center text-sm text-gray-600 mt-4'>
              Already have an account?{' '}
              <Link
                href={'/login'}
                className='font-medium text-blue-600 hover:text-blue-800 transition-colors'
              >
                Sign In here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
