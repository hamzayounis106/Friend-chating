'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SingleCloudinaryUpload from '@/components/cloudinary/SingleCloudinaryUpload';

// Define the schema using Zod
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  image: z.string().url('Invalid image URL').min(1, 'Image is required'),
});

export interface OptionalTypes {
  name: string;
  phone: string;
  city: string;
  country: string;
  description: string;
  address: string;
  image: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Integrate Zod with react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OptionalTypes>({
    resolver: zodResolver(profileSchema),
  });

  // Watch for image updates
  const imageUrl = watch('image');

  useEffect(() => {
    if (session?.user) {
      setValue('name', session.user.name || '');
      setValue('image', session.user.image || '');
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

        router.refresh();
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-6'>Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Grid Container for Two Columns on Desktop */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Name Field */}
          <div className='mb-4'>
            <label className='block font-medium'>Name</label>
            <input
              {...register('name')}
              className='w-full p-2 border rounded'
              disabled
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className='mb-4'>
            <label className='block font-medium'>Phone</label>
            <input
              {...register('phone')}
              className='w-full p-2 border rounded'
            />
            {errors.phone && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* City Field */}
          <div className='mb-4'>
            <label className='block font-medium'>City</label>
            <input
              {...register('city')}
              className='w-full p-2 border rounded'
            />
            {errors.city && (
              <p className='text-red-500 text-sm mt-1'>{errors.city.message}</p>
            )}
          </div>

          {/* Country Field */}
          <div className='mb-4'>
            <label className='block font-medium'>Country</label>
            <input
              {...register('country')}
              className='w-full p-2 border rounded'
            />
            {errors.country && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className='mb-4 md:col-span-2'>
            <label className='block font-medium'>Description</label>
            <textarea
              {...register('description')}
              className='w-full p-2 border rounded'
              rows={4}
            />
            {errors.description && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className='mb-4 md:col-span-2'>
            <label className='block font-medium'>Address</label>
            <input
              {...register('address')}
              className='w-full p-2 border rounded'
            />
            {errors.address && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Image Field */}
          <div className='mb-4 md:col-span-2'>
            <label className='block font-medium'>Profile Image</label>
            {imageUrl && (
              <div className='w-48 relative group cursor-pointer mb-4'>
                <div className='w-64 h-64 rounded-full overflow-hidden'>
                  <Image
                    src={imageUrl || '/default.png'}
                    alt='Profile'
                    width={96}
                    height={96}
                    className='w-full h-full rounded-full object-cover transition-opacity duration-300'
                  />
                </div>
              </div>
            )}
            <SingleCloudinaryUpload
              onUpload={(url) => {
                setValue('image', url); // Set only a single image
              }}
            />
            {errors.image && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.image.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded mt-6 w-full md:w-auto'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
