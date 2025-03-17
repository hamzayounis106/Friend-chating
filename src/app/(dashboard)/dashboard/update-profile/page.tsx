'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface OptionalTypes {
  name: string;
  phone: string;
  city: string;
  country: string;
  description: string;
  address: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<OptionalTypes>();

  console.log('session ure', session);
  useEffect(() => {
    if (session?.user) {
      setValue('name', session.user.name || '');
      setValue('phone', session.user.phone || '');
      setValue('city', session.user.city || '');
      setValue('country', session.user.country || '');
      setValue('description', session.user.description || '');
      setValue('address', session.user.address || '');
    }
  }, [session, setValue]);

  const onSubmit = async (data: OptionalTypes) => {
    setLoading(true);
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Updated user:', updatedUser);

        await update({
          ...session,
          user: {
            ...session?.user,
            ...updatedUser,
          },
        });
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  return (
    <div className='max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label className='block font-medium'>Name</label>
          <input
            {...register('name')}
            className='w-full p-2 border rounded'
            disabled
          />
        </div>
        <div className='mb-4'>
          <label className='block font-medium'>Phone</label>
          <input {...register('phone')} className='w-full p-2 border rounded' />
        </div>
        <div className='mb-4'>
          <label className='block font-medium'>City</label>
          <input {...register('city')} className='w-full p-2 border rounded' />
        </div>
        <div className='mb-4'>
          <label className='block font-medium'>Country</label>
          <input
            {...register('country')}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block font-medium'>Description</label>
          <textarea
            {...register('description')}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='mb-4'>
          <label className='block font-medium'>Address</label>
          <input
            {...register('address')}
            className='w-full p-2 border rounded'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
