'use client';
export default function LoadingState() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500'></div>
    </div>
  );
}

import { useRouter } from 'next/navigation';

export function ErrorState({ error }: { error: string }) {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <h2 className='text-3xl font-semibold text-red-600 mb-4'>{error}</h2>
      <button
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
        onClick={() => router.push('/')}
      >
        Return to Home
      </button>
    </div>
  );
}
