// components/HomeJobForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { JobTypeCombobox } from './JobTypeCombobox';
import Button from '../ui/button';

const homeJobFormSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description should be at least 10 characters long'),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Date must be in the future',
    }),
});

type HomeJobFormData = z.infer<typeof homeJobFormSchema>;

const HomeJobForm = () => {
  const { status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<HomeJobFormData>({
    resolver: zodResolver(homeJobFormSchema),
  });

  const selectedType = watch('type');

  const onSubmit = (data: HomeJobFormData) => {
    localStorage.setItem('homeJobFormData', JSON.stringify(data));
    if (status === 'authenticated') {
      router.push('/dashboard/add');
      toast.success('Form data saved. Redirecting to dashboard...');
    } else {
      router.push('/login');
      toast.success('Form data saved. Please login to continue.');
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg  border border-gray-200'>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Get Unlimited Quotes From Trusted Surgeons
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-1 w-full'>
          <JobTypeCombobox
            value={selectedType}
            onChangeAction={(value) => setValue('type', value)}
            error={errors.type?.message}
          />
        </div>
        {/* Expected Date Field */}
        <div className='space-y-1'>
          <input
            {...register('date')}
            type='date'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
          />
          {errors.date && (
            <p className='text-sm text-red-600'>{errors.date.message}</p>
          )}
        </div>
        <div className='space-y-1'>
          <textarea
            {...register('description')}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            placeholder='Brief Description'
          ></textarea>
          {errors.description && (
            <p className='text-sm text-red-600'>{errors.description.message}</p>
          )}
        </div>
        <div className='flex justify-start '>
          {/* <button
            type='submit'
            className='px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors'
          >
            Submit Job Request
          </button> */}
          <Button type='submit' className='bg-black hover:bg-black/80'>
            Invite Surgeons
          </Button>
        </div>
        <p className='text-[12px]'>
          Free to submit your request. $49 to unlock all surgeon replies for
          your post and escrow protection—no hidden costs.
        </p>
      </form>
    </div>
  );
};

export default HomeJobForm;
