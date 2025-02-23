'use client';

import SignupForm from '@/components/signup/SignupForm';

const SignupPage = () => {
  return (
    <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full flex flex-col items-center max-w-md space-y-8'>
        <div className='flex flex-col items-center gap-8'>
          {/* You can add a logo here */}
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Create a new account
          </h2>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
