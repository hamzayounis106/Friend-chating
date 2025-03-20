import Link from 'next/link';
import { Lock, Stethoscope, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const SurgeonLoginPrompt = () => {
  const { data: session } = useSession();
  const isPatient = session?.user?.role === 'patient';

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100 px-4'>
      <div className='bg-white shadow-xl rounded-2xl p-8 text-center w-96'>
        <div className='flex justify-center items-center mb-4'>
          <Stethoscope className='w-12 h-12 text-blue-600' />
        </div>
        <h1 className='text-2xl font-bold text-gray-800'>
          {isPatient ? 'You are logged in as a Patient' : 'Login as a Surgeon'}
        </h1>
        <p className='mt-3 text-gray-600'>
          {isPatient
            ? 'Log out and log in as a surgeon to view this job.'
            : 'You need to log in or sign up as a surgeon to view this job.'}
        </p>

        {isPatient ? (
          // Logout Button
          <button
            onClick={() => signOut()}
            className='mt-6 flex items-center justify-center w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition'
          >
            <LogOut className='w-5 h-5 mr-2' />
            Logout
          </button>
        ) : (
          // Login Button
          <Link href='/login'>
            <button className='mt-6 flex items-center justify-center w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
              <Lock className='w-5 h-5 mr-2' />
              Login / Signup
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SurgeonLoginPrompt;
