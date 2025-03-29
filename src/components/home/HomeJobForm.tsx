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
import { ArrowRight } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import JobTypeSelect from './JobTypeSelect';

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
    <div className=' bg-[#EAEAEA]  rounded-lg  shadow-md'>
      <div className=' text-center flex flex-col gap-y-2 py-6 px-2 text-white bg-[#005EB8] rounded-t-lg'>
        <h2 className='text-xl sm:text-2xl font-bold '>
          POST YOUR JOB FOR FREE
        </h2>
        <p className=' text-lg sm:text-xl '>
          Get Unlimited Quotes From Trusted Surgeons
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-6'>
        <div className='md:flex md:space-x-4 md:space-y-0 space-y-4'>
          {/* Job Type Field - First column */}
          <div className='md:w-1/2 space-y-1'>
            <JobTypeCombobox
              value={selectedType}
              onChangeAction={(value) => setValue('type', value)}
              error={errors.type?.message}
              options={JobTypeSelect}
              placeholder='Select surgery type...'
              searchPlaceholder='Search surgery types...'
              emptyText='No surgery types found.'
            />
          </div>

          {/* Expected Date Field - Second column */}
          <div className='md:w-1/2 space-y-1'>
            <input
              {...register('date')}
              type='date'
              className='w-full px-4 py-[6px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-auto'
            />
            {errors.date && (
              <p className='text-sm text-red-600'>{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Description Field - Full width below */}
        <div className='space-y-1'>
          <Textarea
            id='description'
            {...register('description')}
            rows={2}
            className='focus-visible:ring-blue-500 bg-white'
            placeholder='Enter a brief description of the job...'
          />
          {errors.description && (
            <p className='text-sm text-red-600'>{errors.description.message}</p>
          )}
        </div>

        <div className='flex justify-start '>
          <Button
            type='submit'
            className='bg-[#005EB8] hover:bg-[#005EB8] flex items-center justify-between gap-12'
          >
            Step 1 of 2 <ArrowRight />
          </Button>
        </div>
        <div className='border-b border-[#DCDCDC]'></div>

        <p className='text-[12px] text-[#18162B]'>
          Free to submit your request. $49 to unlock all surgeon replies for
          your post and escrow protection—no hidden costs.
        </p>
      </form>
    </div>
  );
};

export default HomeJobForm;
