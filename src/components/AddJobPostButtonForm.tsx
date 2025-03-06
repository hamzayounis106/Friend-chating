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
import CloudinaryUpload from './cloudinary/CloudinaryUpload';

interface AddJobButtonProps {}

type FormData = z.infer<typeof addJobValidator>;

const AddJobPostButtonForm: FC<AddJobButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [AttachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  // console.log('All Assests', AttachmentUrls);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addJobValidator),
    defaultValues: {
      AttachmentUrls: [],
      budget: undefined,
    },
  });

  const session = useSession();
  const addJob = async (data: FormData) => {
    try {
      setLoading(true);
      const transformedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        createdBy: session?.data?.user?.id,
        patientId: session?.data?.user?.id,
        surgeonEmails: data.surgeonEmails,
        // videoURLs: data.videoURLs,
        AttachmentUrls: AttachmentUrls,
      };

      await axios.post('/api/Jobs/add', transformedData);

      toast.success('Job successfully added!');
    } catch (error) {
      console.error('Error:', error);

      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return;
      }

      if (error instanceof AxiosError) {
        console.error('Axios Error Response:', error.response?.data);
        setError('title', { message: error.response?.data || 'Server error.' });
        toast.error(error.response?.data || 'Something went wrong.');
        return;
      }

      setError('title', { message: 'Something went wrong.' });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (data: FormData) => {
    if (!data.AttachmentUrls || data.AttachmentUrls.length === 0) {
      data.AttachmentUrls = []; // ✅ Ensure it's an empty array if undefined
    }
    if (typeof data.budget !== 'number') {
      data.budget = undefined;
    }
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
        Budget (USD - optional)
      </label>
      <input
        {...register('budget', {
          setValueAs: (v) => (v === '' ? undefined : Number(v)),
        })}
        type='number'
        step='0.01'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='Enter budget amount (optional)'
      />
      <p className='text-sm text-red-600'>{errors.budget?.message}</p>
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
      {/* <label className='block text-sm font-medium text-gray-900'>
        Video URLs (comma separated)
      </label>
      <input
        {...register('videoURLs')}
        type='text'
        className='block w-full rounded-md border py-1.5 text-gray-900 shadow-sm'
        placeholder='https://example.com/video1, https://example.com/video2'
      />
      <p className='text-sm text-red-600'>{errors.videoURLs?.message}</p> */}
      <label className='block text-sm font-medium text-gray-900'>
        Attach Files Images/Videos
      </label>
      <CloudinaryUpload
        onUpload={(newUrls) => {
          setValue('AttachmentUrls', [...AttachmentUrls, ...newUrls], {
            shouldValidate: true,
          });
          setAttachmentUrls((prev) => [...prev, ...newUrls]);
        }}
      />
      {AttachmentUrls?.length > 0 && (
        <p className='text-sm text-green-600'>
          {AttachmentUrls.length < 2
            ? 'File is Uploaded'
            : 'Files are Uploaded'}
        </p>
      )}
      {errors.AttachmentUrls && (
        <p className='text-sm text-red-600'>{errors.AttachmentUrls?.message}</p>
      )}
      <label className='block text-sm font-medium text-gray-900'>
        Agree to Terms
      </label>
      <input
        {...register('agreeToTerms')}
        type='checkbox'
        className='rounded-md border py-1.5 text-gray-900 shadow-sm'
      />
      <p className='text-sm text-red-600'>{errors.agreeToTerms?.message}</p>
      <Button type='submit' disabled={loading}>
        {loading ? 'Adding Job...' : 'Add Job'}
      </Button>{' '}
      {showSuccessState && (
        <p className='text-sm text-green-600'>Job request sent!</p>
      )}
    </form>
  );
};

export default AddJobPostButtonForm;
