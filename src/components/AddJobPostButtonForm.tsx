'use client';

import axios, { AxiosError } from 'axios';
import { FC, useState } from 'react';
import Button from './ui/Button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addJobValidator } from '@/lib/validations/add-Job';
import { useSession } from 'next-auth/react';

interface AddJobButtonProps {}

type FormData = z.infer<typeof addJobValidator>;

const AddJobPostButtonForm: FC<AddJobButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addJobValidator),
  });
  const session = useSession()
  console.log("session",  session?.data?.user?.email);
  const currentUserEmail = session?.data?.user?.email; 
  const addJob = async (data: FormData) => {
    try {
      const transformedData = {
        ...data,
        date: data.date.toISOString(), // Transform date to string
        surgeonEmails: data.surgeonEmails.join(','), // Transform array to string
        videoURLs: data.videoURLs.join(','), // Transform array to string
      };
         // Check if any surgeon email is the same as the current user's email
         if (data.surgeonEmails.includes(currentUserEmail as string)) {
          setError('surgeonEmails', { message: 'You cannot invite yourself.' });
          return;
        }
  
      const validatedData = addJobValidator.parse(transformedData);
      console.log("validatedData", validatedData);
      await axios.post('/api/Jobs/add', validatedData);

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return;
      }

      if (error instanceof AxiosError) {
        setError('title', { message: error.response?.data });
        return;
      }

      setError('title', { message: 'Something went wrong.' });
    }
  };

  const onSubmit = (data: FormData) => {
    addJob(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm space-y-4'>
      <label htmlFor='title' className='block text-sm font-medium leading-6 text-gray-900'>
        Job Title
      </label>
      <input
        {...register('title')}
        type='text'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='Job Title'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.title?.message}</p>

      <label htmlFor='type' className='block text-sm font-medium leading-6 text-gray-900'>
        Job Type
      </label>
      <input
        {...register('type')}
        type='text'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='Job Type'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.type?.message}</p>

      <label htmlFor='date' className='block text-sm font-medium leading-6 text-gray-900'>
        Job Date
      </label>
      <input
        {...register('date')}
        type='date'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.date?.message}</p>

      <label htmlFor='description' className='block text-sm font-medium leading-6 text-gray-900'>
        Job Description
      </label>
      <textarea
        {...register('description')}
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='Job Description'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.description?.message}</p>

      <label htmlFor='surgeonEmails' className='block text-sm font-medium leading-6 text-gray-900'>
        Surgeon Emails (comma separated)
      </label>
      <input
        {...register('surgeonEmails')}
        type='text'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='email1@example.com, email2@example.com'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.surgeonEmails?.message}</p>

      <label htmlFor='videoURLs' className='block text-sm font-medium leading-6 text-gray-900'>
        Video URLs (comma separated)
      </label>
      <input
        {...register('videoURLs')}
        type='text'
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder='https://example.com/video1, https://example.com/video2'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.videoURLs?.message}</p>

      <label htmlFor='agreeToTerms' className='block text-sm font-medium leading-6 text-gray-900'>
        Agree to Terms
      </label>
      <input
        {...register('agreeToTerms')}
        type='checkbox'
        className='block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
      />
      <p className='mt-1 text-sm text-red-600'>{errors.agreeToTerms?.message}</p>

      <Button type='submit'>Add Job</Button>
      {showSuccessState ? (
        <p className='mt-1 text-sm text-green-600'>Job request sent!</p>
      ) : null}
    </form>
  );
};

export default AddJobPostButtonForm;