'use client';

import axios, { AxiosError } from 'axios';
import { FC, useState } from 'react';
import Button from './ui/Button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addJobValidator } from '@/lib/validations/add-Job';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface AddJobButtonProps {}

type FormData = z.infer<typeof addJobValidator>;

const AddJobPostButtonForm: FC<AddJobButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addJobValidator),
  });

  const session = useSession();
  const addJob = async (data: FormData) => {
    try {
      const transformedData = {
        ...data,
        date: new Date(data.date).toISOString(), // Convert date to ISO
        createdBy: session?.data?.user?.id, // Replace with actual user ID
        patientId: session?.data?.user?.id, // Replace with actual patient ID
        surgeonEmails: data.surgeonEmails, // Already a comma-separated string
        videoURLs: data.videoURLs, // Already a comma-separated string
      };

      // console.log('Validated Data:', transformedData);

      await axios.post('/api/Jobs/add', transformedData);
      setShowSuccessState(true);
    } catch (error) {
      console.error('Error:', error); // Log the full error object

      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return;
      }

      if (error instanceof AxiosError) {
        console.error('Axios Error Response:', error.response?.data); // Log the Axios error response
        setError('title', { message: error.response?.data || 'Server error.' });
        return;
      }

      setError('title', { message: 'Something went wrong.' });
    }
  };
  const onSubmit = (data: FormData) => {
    const userEmail = session.data?.user.email;
    // console.log(userEmail);
    const containEmail = data?.surgeonEmails.some(
      (item) => item.email === userEmail
    );
    if (containEmail) {
      toast.error(`You can't invite yourself to this post`);
      return;
    }
    addJob(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm space-y-4'>
      <label className='block text-sm font-medium text-gray-900'>
        Job Title
      </label>
      <input
        {...register('title')}
        type='text'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='Job Title'
      />
      <p className='text-sm text-red-600'>{errors.title?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Job Type
      </label>
      <input
        {...register('type')}
        type='text'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='Job Type'
      />
      <p className='text-sm text-red-600'>{errors.type?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Job Date
      </label>
      <input
        {...register('date')}
        type='date'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
      />
      <p className='text-sm text-red-600'>{errors.date?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Job Description
      </label>
      <textarea
        {...register('description')}
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='Job Description'
      />
      <p className='text-sm text-red-600'>{errors.description?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Surgeon Emails (comma separated)
      </label>
      <input
        {...register('surgeonEmails')}
        type='text'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='email1@example.com, email2@example.com'
      />
      <p className='text-sm text-red-600'>{errors.surgeonEmails?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Video URLs (comma separated)
      </label>
      <input
        {...register('videoURLs')}
        type='text'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='https://example.com/video1, https://example.com/video2'
      />
      <p className='text-sm text-red-600'>{errors.videoURLs?.message}</p>

      <label className='block text-sm font-medium text-gray-900'>
        Agree to Terms
      </label>
      <input
        {...register('agreeToTerms')}
        type='checkbox'
        className='rounded-md border py-1.5 text-gray-900 shadow-sm'
      />
      <p className='text-sm text-red-600'>{errors.agreeToTerms?.message}</p>

      <Button type='submit'>Add Job</Button>

      {showSuccessState && (
        <p className='text-sm text-green-600'>Job request sent!</p>
      )}
    </form>
  );
};

export default AddJobPostButtonForm;
