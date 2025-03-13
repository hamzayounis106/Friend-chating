'use client';

import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import Button from './custom-ui/Button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addJobValidator } from '@/lib/validations/add-Job';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import CloudinaryUpload from './cloudinary/CloudinaryUpload';
import {
  CalendarIcon,
  Upload,
  PlusCircle,
  AlertCircle,
  FileText,
  Users,
  DollarSign,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { jobTypes } from './home/HomeJobForm';

interface AddJobButtonProps {}

type FormData = z.infer<typeof addJobValidator>;

const AddJobPostButtonForm: FC<AddJobButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [AttachmentUrls, setAttachmentUrls] = useState<string[]>([]);

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
        AttachmentUrls: AttachmentUrls,
      };

      await axios.post('/api/Jobs/add', transformedData);
      setShowSuccessState(true);
      toast.success('Job successfully added!');
      localStorage.removeItem('homeJobFormData');

      // Reset form after successful submission
      setTimeout(() => {
        setShowSuccessState(false);
      }, 3000);
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
        // setError('title', { message: error.response?.data || 'Server error.' });
        toast.error(error.response?.data || 'Something went wrong.');
        return;
      }

      // setError('title', { message: 'Something went wrong.' });
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!data.AttachmentUrls || data.AttachmentUrls.length === 0) {
      data.AttachmentUrls = []; // Ensure it's an empty array if undefined
    }
    if (typeof data.budget !== 'number') {
      data.budget = undefined;
    }
    const userEmail = session.data?.user.email;
    const containEmail = data?.surgeonEmails.some(
      (item) => item.email === userEmail
    );
    if (containEmail) {
      toast.error(`You can't invite yourself to this post`);
      return;
    }
    addJob(data);
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('homeJobFormData');
    console.log('saved form data shoe here 😁😁😁😁', savedFormData);
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof FormData, parsedData[key]);
      });
      setAttachmentUrls(parsedData.AttachmentUrls || []);
    }
  }, [setValue]);
  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Create New Job Request
        </h2>
        <p className='text-gray-500 mt-1'>
          Fill out the form below to post a new cosmetic surgery job request
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Form Grid Layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Title */}
          {/* <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <FileText className='w-4 h-4 mr-2 text-indigo-600' />
              Job Title
            </label>
            <input
              {...register('title')}
              type='text'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
              placeholder='e.g., Rhinoplasty Consultation'
            />
            {errors.title && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.title.message}
              </p>
            )}
          </div> */}

          {/* Type */}

          {/* Type */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <FileText className='w-4 h-4 mr-2 text-indigo-600' />
              Job Type
            </label>
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
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <CalendarIcon className='w-4 h-4 mr-2 text-indigo-600' />
              Preferred Date
            </label>
            <div className='relative'>
              <input
                {...register('date')}
                type='date'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
              />
            </div>
            {errors.date && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Budget */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <DollarSign className='w-4 h-4 mr-2 text-indigo-600' />
              Budget (USD - optional)
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
                $
              </span>
              <input
                {...register('budget', {
                  setValueAs: (v) => (v === '' ? undefined : Number(v)),
                })}
                type='number'
                step='0.01'
                className='w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                placeholder='Enter amount (optional)'
              />
            </div>
            {errors.budget && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.budget.message}
              </p>
            )}
          </div>
        </div>

        {/* Description - Full Width */}
        <div className='space-y-2'>
          <label className='flex items-center text-sm font-medium text-gray-700'>
            <FileText className='w-4 h-4 mr-2 text-indigo-600' />
            Job Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            placeholder="'Describe the procedure you're looking for, any specific requirements, and other relevant details."
          />
          {errors.description && (
            <p className='text-sm text-red-600 flex items-start'>
              <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Surgeon Emails */}
        <div className='space-y-2'>
          <label className='flex items-center text-sm font-medium text-gray-700'>
            <Users className='w-4 h-4 mr-2 text-indigo-600' />
            Surgeon Emails (comma separated)
          </label>
          <input
            {...register('surgeonEmails')}
            type='text'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            placeholder='e.g., surgeon1@example.com, surgeon2@example.com'
          />
          {errors.surgeonEmails && (
            <p className='text-sm text-red-600 flex items-start'>
              <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
              {errors.surgeonEmails.message}
            </p>
          )}
        </div>

        {/* File Uploads */}
        <div className='space-y-2'>
          <label className='flex items-center text-sm font-medium text-gray-700'>
            <Upload className='w-4 h-4 mr-2 text-indigo-600' />
            Upload Images/Videos
          </label>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50'>
            <CloudinaryUpload
              onUpload={(newUrls) => {
                setValue('AttachmentUrls', [...AttachmentUrls, ...newUrls], {
                  shouldValidate: true,
                });
                setAttachmentUrls((prev) => [...prev, ...newUrls]);
              }}
            />

            {uploadingFiles && (
              <p className='mt-2 text-sm text-indigo-600 flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Uploading files...
              </p>
            )}

            {AttachmentUrls?.length > 0 && !uploadingFiles && (
              <div className='mt-3'>
                <p className='text-sm text-green-600 flex items-center'>
                  <Check className='w-4 h-4 mr-1' />
                  {`${AttachmentUrls.length} ${
                    AttachmentUrls.length === 1 ? 'file' : 'files'
                  } uploaded successfully`}
                </p>

                {/* Preview of uploaded files */}
                <div className='grid grid-cols-3 md:grid-cols-4 gap-2 mt-2'>
                  {AttachmentUrls.slice(0, 4).map((url, index) => (
                    <div
                      key={index}
                      className='relative h-16 bg-gray-100 rounded overflow-hidden'
                    >
                      {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                        <div className='flex items-center justify-center h-full bg-gray-800 text-white text-xs'>
                          Video File
                        </div>
                      ) : (
                        <Image
                          src={url || '/default.png'}
                          alt='Attachment'
                          sizes='(max-width: 768px) 100vw, 24px'
                          fill
                          className='object-cover rounded-lg transition-transform '
                        />
                      )}
                    </div>
                  ))}
                  {AttachmentUrls.length > 4 && (
                    <div className='flex items-center justify-center h-16 bg-gray-100 text-gray-500 rounded text-sm'>
                      +{AttachmentUrls.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.AttachmentUrls && (
              <p className='text-sm text-red-600 flex items-start mt-2'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.AttachmentUrls.message}
              </p>
            )}
          </div>
          <p className='text-xs text-gray-500'>
            Upload images or videos related to your request (optional)
          </p>
        </div>

        {/* Terms */}
        <div className='space-y-2'>
          <div className='flex items-center'>
            <input
              {...register('agreeToTerms')}
              type='checkbox'
              id='terms'
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='terms' className='ml-2 block text-sm text-gray-700'>
              I agree to the terms and conditions
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className='text-sm text-red-600 flex items-start'>
              <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className='flex justify-center pt-4'>
          <Button
            type='submit'
            className={`px-8 py-3 rounded-md flex items-center justify-center text-white font-medium ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } transition-colors`}
            disabled={loading || uploadingFiles}
          >
            {loading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Adding Job...
              </>
            ) : (
              <>
                <PlusCircle className='w-4 h-4 mr-2' />
                Submit Job Request
              </>
            )}
          </Button>
        </div>

        {showSuccessState && (
          <div className='mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center'>
            <Check className='w-5 h-5 mr-2' />
            <p>Job request submitted successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddJobPostButtonForm;
