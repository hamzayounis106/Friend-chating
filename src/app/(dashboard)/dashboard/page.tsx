import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("no session")
    redirect('/login');
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      {session?.user && (
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex items-center space-x-4'>
            <div className='relative h-12 w-12'>
              <Image
                src={session.user.image || '/default.png'}
                alt={session.user.name || 'User'}
                className='rounded-full'
                fill
                sizes='(max-width: 48px) 100vw'
              />
            </div>
            <div>
              <h2 className='text-xl font-semibold'>{session.user.name}</h2>
              <p className='text-gray-600'>{session.user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
