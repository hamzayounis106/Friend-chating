'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import Button from '../ui/button';
import { subscribe } from '@/app/actions/subscribe';

// ✅ Define Zod schema for validation
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

// ✅ Define TypeScript Type
export type FormDataNewsLetter = z.infer<typeof schema>;

export default function Newsletter() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Use React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormDataNewsLetter>({
    resolver: zodResolver(schema),
  });

  // ✅ Handle form submission
  const onSubmit = async (data: FormDataNewsLetter) => {
    setIsLoading(true);
    try {
      const result = await subscribe(data);

      if (result?.success) {
        toast({
          title: 'Success!',
          description: result.message,
          variant: 'default',
        });
        reset(); // ✅ Reset form after successful submission
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to subscribe.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-4 w-full md:min-w-[280px] lg:max-w-[320px]'>
      <h3 className='text-lg font-semibold'>Newsletter</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col space-y-3'
      >
        <Input
          {...register('email')}
          type='email'
          placeholder='Your email'
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
        <Button type='submit' disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? 'Submitting...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}
