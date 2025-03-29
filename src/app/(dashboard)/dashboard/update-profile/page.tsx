'use client';

import {
  FileText,
  Phone,
  MapPin,
  Globe,
  Home,
  User,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
    .max(15, 'Phone number is too long')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  image: z.string().url('Invalid image URL').min(1, 'Image is required'),
});

export interface ProfileFormValues {
  name: string;
  phone: string; // Changed from number to string
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

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

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await update({
          ...session,
          user: {
            ...session?.user,
            ...updatedUser,
          },
        });
        router.refresh();
        setTimeout(() => router.push('/dashboard'), 500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-6 flex items-center gap-2'>
        <User className='w-5 h-5' />
        Update Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Name Field */}
          <div className='space-y-2'>
            <Label htmlFor='name' className='flex items-center gap-2'>
              <User className='w-4 h-4' />
              Name
            </Label>
            <Input id='name' {...register('name')} disabled className='pl-9' />
            {errors.name && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className='space-y-2'>
            <Label htmlFor='phone' className='flex items-center gap-2'>
              <Phone className='w-4 h-4' />
              Phone
            </Label>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='phone'
                type='tel'
                {...register('phone')}
                className='pl-9'
                placeholder='1234567890'
              />
            </div>
            {errors.phone && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Other fields remain the same... */}
          {/* City Field */}
          <div className='space-y-2'>
            <Label htmlFor='city' className='flex items-center gap-2'>
              <MapPin className='w-4 h-4' />
              City
            </Label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input id='city' {...register('city')} className='pl-9' />
            </div>
            {errors.city && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Country Field */}
          <div className='space-y-2'>
            <Label htmlFor='country' className='flex items-center gap-2'>
              <Globe className='w-4 h-4' />
              Country
            </Label>
            <div className='relative'>
              <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input id='country' {...register('country')} className='pl-9' />
            </div>
            {errors.country && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='description' className='flex items-center gap-2'>
              <FileText className='w-4 h-4' />
              Description
            </Label>
            <Textarea id='description' {...register('description')} rows={4} />
            {errors.description && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='address' className='flex items-center gap-2'>
              <Home className='w-4 h-4' />
              Address
            </Label>
            <div className='relative'>
              <Home className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input id='address' {...register('address')} className='pl-9' />
            </div>
            {errors.address && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Image Field */}
          <div className='space-y-2 md:col-span-2'>
            <Label className='flex items-center gap-2'>
              <ImageIcon className='w-4 h-4' />
              Profile Image
            </Label>
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
                setValue('image', url);
              }}
            />
            {errors.image && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircle className='w-4 h-4' />
                {errors.image.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type='submit'
          className='mt-6 w-full md:w-auto'
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </div>
  );
}
