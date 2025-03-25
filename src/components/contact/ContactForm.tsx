'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm } from '@/app/contact/actions';
import {
  ContactFormInputs,
  ContactFormSchema,
} from '@/lib/validations/contact';
import { useToast } from '@/hooks/use-toast';

export default function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormInputs) => {
    const result = await submitContactForm(data);

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Your message has been sent successfully.',
        variant: 'default',
      });
      reset();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className='w-3/4 md:w-1/2 flex flex-col gap-6'>
      <h1 className='md:text-4xl text-2xl'>Contact Form</h1>
      <p>
        Get in touch with us for inquiries or consultations. We&apos;re here to
        help!
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div className='space-y-2'>
          <Input
            id='name'
            {...register('name')}
            placeholder='Full Name'
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className='text-sm text-red-500 mt-1'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Input
            id='email'
            type='email'
            {...register('email')}
            placeholder='Email'
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Input
            id='subject'
            {...register('subject')}
            placeholder='Subject of the message'
            className={errors.subject ? 'border-red-500' : ''}
          />
          {errors.subject && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Textarea
            id='message'
            {...register('message')}
            rows={5}
            placeholder='Type your message here...'
            className={errors.message ? 'border-red-500' : ''}
          />
          {errors.message && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-blue-600 hover:bg-blue-700'
        >
          {isSubmitting ? (
            <span className='flex items-center'>
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
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </main>
  );
}
