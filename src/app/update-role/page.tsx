'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define Zod schema for validation
const RoleSchema = z.object({
  role: z.enum(['patient', 'surgeon'], {
    message: 'Invalid role selection',
  }),
});

// Define TypeScript type from schema
type RoleFormData = z.infer<typeof RoleSchema>;

const UpdateRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { update } = useSession();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(RoleSchema),
    defaultValues: { role: 'patient' },
  });

  const onSubmit = async (data: RoleFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await axios.post('/api/update-user-role', data);

      if (status !== 200) {
        throw new Error('Failed to update role');
      }

      // Refresh session to update role
      if (update) {
        await update();
      } else {
        router.refresh();
      }

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Update Your Role</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 max-w-sm'
      >
        <label className='flex flex-col'>
          Choose your role:
          <select {...register('role')} className='mt-1 p-2 border rounded'>
            <option value='patient'>Patient</option>
            <option value='surgeon'>Surgeon</option>
          </select>
          {errors.role && <p className='text-red-500'>{errors.role.message}</p>}
        </label>
        {error && <p className='text-red-500'>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
        >
          {loading ? 'Updating...' : 'Update Role'}
        </button>
      </form>
    </div>
  );
};

export default UpdateRolePage;
