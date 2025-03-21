'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Define the schema for the form validation
const homeJobFormSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z
    .string()
    .min(1, 'Description is required') // Error when the field is empty
    .min(10, 'Description should be at least 10 characters long'),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Date must be in the future',
    }),
});

type HomeJobFormData = z.infer<typeof homeJobFormSchema>;

export const jobTypes = [
  'Facial Surgery',
  'Orthopedic Surgery',
  'Neurosurgery',
  'Plastic Surgery',
  'General Surgery',
];

const HomeJobForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HomeJobFormData>({
    resolver: zodResolver(homeJobFormSchema),
  });

  const onSubmit = (data: HomeJobFormData) => {
    // Store the form data in local storage
    localStorage.setItem('homeJobFormData', JSON.stringify(data));

    // Check if the user is logged in
    if (status === 'authenticated') {
      // Redirect to /dashboard/add if logged in
      router.push('/dashboard/add');
      toast.success('Form data saved. Redirecting to dashboard...');
    } else {
      // Redirect to login page if not logged in
      router.push('/login');
      toast.success('Form data saved. Please login to continue.');
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>Home Job Form</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Job Type</label>
          <select
            {...register('type')}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
          >
            {jobTypes.map((job, index) => (
              <option key={index} value={job}>
                {job}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className='text-sm text-red-600'>{errors.type.message}</p>
          )}
        </div>

        {/* Expected Date Field */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Expected Date
          </label>
          <input
            {...register('date')}
            type='date'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
          />
          {errors.date && (
            <p className='text-sm text-red-600'>{errors.date.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Job Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            placeholder='Describe the procedure...'
          ></textarea>
          {errors.description && (
            <p className='text-sm text-red-600'>{errors.description.message}</p>
          )}
        </div>

        <div className='flex justify-center pt-4'>
          <button
            type='submit'
            className='px-8 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors'
          >
            Submit Job Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeJobForm;
