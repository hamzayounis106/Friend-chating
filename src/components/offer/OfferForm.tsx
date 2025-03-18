'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { DollarSign, Calendar, MapPin, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const offerSchema = z.object({
  cost: z.coerce.number().min(0, 'Cost cannot be negative'),
  date: z.string().nonempty('Date is required'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters long')
    .max(200, 'Location is too long'),
  description: z.string().nonempty('Description is required'),
});

interface OfferFormProps {
  chatPartner: {
    id: string;
    name: string;
    email: string;
  };
  jobId: string;
  userId: string;
}

const OfferForm = ({ chatPartner, jobId, userId }: OfferFormProps) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      cost: undefined,
      date: '',
      location: '',
      description: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/offers', {
        ...data,
        jobId,
        senderId: userId,
        receiverId: chatPartner.id,
      });

      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      toast.success('Offer sent successfully');
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if response and errors exist
        if (error.response?.data?.errors) {
          console.error('Validation errors:', error.response.data.errors);
        } else {
          console.error(
            'Offer submission failed:',
            error.response?.data || error.message
          );
        }
      } else {
        console.error('Unexpected error:', error);
      }
      toast.error('Failed to submit offer. Please try again.');
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {/* Form Header */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200'>
        <h3 className='text-lg font-bold text-gray-800'>Create New Offer</h3>
        <p className='text-sm text-gray-600 mt-1'>
          Send an offer to{' '}
          <span className='font-medium'>{chatPartner.name}</span> for this job
        </p>
      </div>

      {/* Form Body */}
      <div className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* Success Message */}
          {showSuccess && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-4'>
              <svg
                className='w-5 h-5 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Offer successfully sent to {chatPartner.name}!
            </div>
          )}

          {/* Cost Field */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <DollarSign className='w-4 h-4 mr-2 text-indigo-600' />
              Offer Amount
            </label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
                $
              </span>
              <input
                type='number'
                {...register('cost')}
                className='w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                placeholder='Enter your price offer'
              />
            </div>
            {errors.cost?.message && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {String(errors.cost.message)}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <Calendar className='w-4 h-4 mr-2 text-indigo-600' />
              Proposed Surgery Date
            </label>
            <div className='relative'>
              <input
                type='date'
                {...register('date')}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
              />
            </div>
            {errors.date?.message && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {String(errors.date.message)}
              </p>
            )}
            <p className='text-xs text-gray-500'>
              The proposed date for the procedure
            </p>
          </div>

          {/* Location Field */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <MapPin className='w-4 h-4 mr-2 text-indigo-600' />
              Procedure Location
            </label>
            <input
              type='text'
              {...register('location')}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
              placeholder='e.g., NYC Medical Center'
            />
            {errors.location?.message && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {String(errors.location.message)}
              </p>
            )}
          </div>
          {/* Description Field */}
          <div className='space-y-2'>
            <label className='flex items-center text-sm font-medium text-gray-700'>
              <MapPin className='w-4 h-4 mr-2 text-indigo-600' />
              Procedure Description
            </label>
            <textarea
              {...register('description')}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
              placeholder='e.g., About the Procedure Description   '
            />
            {errors.description?.message && (
              <p className='text-sm text-red-600 flex items-start'>
                <AlertCircle className='w-4 h-4 mr-1 mt-0.5 flex-shrink-0' />
                {String(errors.description.message)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center px-4 py-2.5 rounded-md text-white font-medium transition-colors ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
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
                  Sending Offer...
                </>
              ) : (
                <>
                  <Send className='w-4 h-4 mr-2' />
                  Send Offer to {chatPartner.name}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
