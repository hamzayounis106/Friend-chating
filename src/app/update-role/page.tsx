'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const RoleSchema = z.object({
  role: z.enum(['patient', 'surgeon'], {
    message: 'Invalid role selection',
  }),
});

type RoleFormData = z.infer<typeof RoleSchema>;

const UpdateRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false); // New state to track submission
  const router = useRouter();
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: { role: 'patient' },
  });

  const onSubmit = async (data: RoleFormData) => {
    if (submitted) return; // Prevent multiple submissions

    setLoading(true);
    setError(null);
    setSubmitted(true); // Mark as submitted

    try {
      const { status } = await axios.post('/api/update-user-role', data);

      if (status !== 200) {
        throw new Error('Failed to update role');
      }

      if (update) {
        await update();
      }

      const redirectPath =
        data.role === 'patient' ? '/dashboard/add' : '/dashboard';
      router.push(redirectPath);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      setSubmitted(false); // Allow retry on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>
          How would you like to join our platform?
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Choose your role:
            </label>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='patient'
                  value='patient'
                  className='mr-2'
                  {...register('role')}
                />
                <label htmlFor='patient' className='text-gray-700'>
                  I am a patient
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='radio'
                  id='surgeon'
                  value='surgeon'
                  className='mr-2'
                  {...register('role')}
                />
                <label htmlFor='surgeon' className='text-gray-700'>
                  I am a surgeon
                </label>
              </div>
            </div>
            {errors.role && (
              <p className='text-red-500 text-xs italic mt-1'>
                {errors.role.message}
              </p>
            )}
          </div>

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
              <strong className='font-bold'>Error!</strong>
              <span className='block sm:inline'>{error}</span>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={loading || submitted} // Disable if loading OR already submitted
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 w-full ${
                loading || submitted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading
                ? 'Updating...'
                : submitted
                ? 'Role Updated'
                : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRolePage;
