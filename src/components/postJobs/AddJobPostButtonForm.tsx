'use client';

import axios, { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import Button from '../custom-ui/Button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addJobValidator } from '@/lib/validations/add-Job';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import CloudinaryUpload from '../cloudinary/CloudinaryUpload';
import {
  CalendarIcon,
  Upload,
  PlusCircle,
  AlertCircle,
  FileText,
  Users,
  DollarSign,
  Check,
  LocateIcon,
} from 'lucide-react';
import Image from 'next/image';
import { JobTypeCombobox } from '../home/JobTypeCombobox';
import JobTypeSelect from '../home/JobTypeSelect';
import { LocationCombobox } from './LocationCombobox';

interface AddJobButtonProps {}

type FormData = z.infer<typeof addJobValidator>;

const AddJobPostButtonForm: FC<AddJobButtonProps> = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [AttachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addJobValidator),
    defaultValues: {
      AttachmentUrls: [],
    },
  });

  const session = useSession();

  const addJob = async (data: FormData) => {
    console.log('location inside the data ', data.location);
    try {
      setLoading(true);
      const transformedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        createdBy: session?.data?.user?.id,
        patientId: session?.data?.user?.id,
        surgeonEmails: data.surgeonEmails,
        AttachmentUrls: AttachmentUrls,
        location: data.location,
      };

      await axios.post('/api/Jobs/add', transformedData);
      setShowSuccessState(true);
      toast.success('Job successfully added!');
      localStorage.removeItem('homeJobFormData');
      reset();
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
      data.AttachmentUrls = [];
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
    setAttachmentUrls([]);
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('homeJobFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof FormData, parsedData[key]);
      });
      setAttachmentUrls(parsedData.AttachmentUrls || []);
    }
  }, [setValue]);
  const handleAddEmail = (email: string) => {
    try {
      // Get the current emails from the form state
      const currentEmails = getValues('surgeonEmails') || [];

      // Add the new email to the array
      const updatedEmails: { email: string; status: 'pending' }[] = [
        ...currentEmails,
        { email, status: 'pending' },
      ];

      // Validate the updated array against the Zod schema
      z.array(
        z.object({
          email: z.string().email('Provide a valid email.'),
          status: z.literal('pending'),
        })
      )
        .min(1, { message: 'At least one surgeon email is required.' })
        .refine(
          (emails) =>
            new Set(emails.map((emailObj) => emailObj.email)).size ===
            emails.length,
          { message: 'Duplicate emails are not allowed.' }
        )
        .parse(updatedEmails);

      // Update the form state with the validated emails
      setValue('surgeonEmails', updatedEmails, {
        shouldValidate: true,
      });

      // Clear the input field
      const input = document.getElementById(
        'surgeonEmailInput'
      ) as HTMLInputElement;
      input.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display Zod validation errors
        toast.error(error.errors[0].message);
      }
    }
  };
  const handleAddLocation = (location: string) => {
    try {
      const currentLocations = getValues('location') || [];
      const updatedLocations = [...currentLocations, location];

      z.array(
        z.string().min(5, { message: 'Location must be at least 5 characters' })
      )
        .refine(
          (location) =>
            new Set(location.map((singleLocation) => singleLocation)).size ===
            location.length,
          { message: 'Duplicate Locations are not allowed' }
        )
        .parse(updatedLocations);

      setValue('location', updatedLocations, {
        shouldValidate: true,
      });
      const input = document.getElementById(
        'locationInput'
      ) as HTMLInputElement;
      input.value = '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    }
  };
  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <div className='mb-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Get Free Quotes – From Trusted Surgeons Worldwide
        </h2>
        <p className='text-gray-500 mt-1'>
          Fill out the form below to post a new cosmetic surgery job request
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Form Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* First Column - Job Type */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <FileText className='w-4 h-4 mr-2 text-indigo-600' />
              Job Type
            </label>
            <JobTypeCombobox
              value={watch('type')}
              onChangeAction={(value) => setValue('type', value)}
              error={errors.type?.message}
              options={JobTypeSelect}
              placeholder='Select surgery type...'
              searchPlaceholder='Search surgery types...'
              emptyText='No surgery types found.'
            />
          </div>

          {/* Second Column - Date */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <CalendarIcon className='w-4 h-4 mr-2 text-indigo-600' />
              Preferred Date (roughly)
            </label>
            <div className='relative'>
              <input
                {...register('date')}
                type='date'
                className='w-full px-4 py-[6px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
              />
            </div>
            {errors.date && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Third Item - Locations (spans full width on lg screens) */}
          <div className='space-y-2 lg:col-span-2'>
            <LocationCombobox
              value={watch('location') as string[]}
              onChangeValueData={(locations) => setValue('location', locations)}
              error={errors?.location?.message}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <label className='flex items-center text-sm font-medium text-gray-700'>
            <FileText className='w-4 h-4 mr-2 text-indigo-600' />
            Describe your needs
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
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
            Surgeon Emails
          </label>
          <div className='relative flex items-center'>
            <input
              type='text'
              id='surgeonEmailInput'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all'
              placeholder='Enter surgeon email'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent form submission
                  const input = e.target as HTMLInputElement;
                  const email = input.value.trim();
                  if (email) {
                    handleAddEmail(email);
                  }
                }
              }}
            />
            <button
              type='button'
              onClick={() => {
                const input = document.getElementById(
                  'surgeonEmailInput'
                ) as HTMLInputElement;
                const email = input.value.trim();
                if (email) {
                  handleAddEmail(email);
                }
              }}
              className='ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
            >
              Add
            </button>
          </div>
          <div className='flex flex-wrap gap-2 mt-2'>
            {getValues('surgeonEmails')?.map(
              (surgeon: { email: string; status: string }, index: number) => (
                <div
                  key={index}
                  className='flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm'
                >
                  {surgeon.email}
                  <button
                    type='button'
                    onClick={() => {
                      const emails = getValues('surgeonEmails').filter(
                        (_, i) => i !== index
                      );
                      setValue('surgeonEmails', emails, {
                        shouldValidate: true,
                      });
                    }}
                    className='ml-2 text-indigo-500 hover:text-indigo-700'
                  >
                    &times;
                  </button>
                </div>
              )
            )}
          </div>

          {errors.surgeonEmails && (
            <p className='text-sm text-red-600 flex items-start'>
              <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
              {errors.surgeonEmails.message === 'Required'
                ? 'Invite your surgeons to start Job'
                : errors.surgeonEmails.message}
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

            {AttachmentUrls?.length > 0 && (
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
              className='h-4 w-4 text-indigo-600 focus:ring-blue-600 border-gray-300 rounded'
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
            disabled={loading}
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
