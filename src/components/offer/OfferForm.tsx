'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const offerSchema = z.object({
  cost: z.coerce.number().min(0, 'Cost cannot be negative'),
  date: z.string().nonempty('Date is required'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters long')
    .max(200, 'Location is too long'),
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(offerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/api/offers', {
        ...data,
        jobId,
        senderId: userId,
        receiverId: chatPartner.id,
      });
      router.refresh();

      reset();
      toast.success('Post sent Successfully');
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl'>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Cost
          </label>
          <input
            type='number'
            {...register('cost')}
            className='w-full px-3 py-2 border rounded-md'
          />
          {errors.cost?.message && (
            <p className='text-red-500 text-sm'>
              {String(errors.cost.message)}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Proposed Date
          </label>
          <input
            type='date'
            {...register('date')}
            className='w-full px-3 py-2 border rounded-md'
          />
          {errors.date?.message && (
            <p className='text-red-500 text-sm'>
              {String(errors.date.message)}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Location
          </label>
          <input
            type='text'
            {...register('location')}
            className='w-full px-3 py-2 border rounded-md'
          />
          {errors.location?.message && (
            <p className='text-red-500 text-sm'>
              {String(errors.location.message)}
            </p>
          )}
        </div>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
      >
        {isSubmitting ? 'Sending...' : 'Send Offer'}
      </button>
    </form>
  );
};

export default OfferForm;
