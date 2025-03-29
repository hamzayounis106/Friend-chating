'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import SavedProgressNotification from '../SavedProgressNotification';

const signupSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['patient', 'surgeon'], {
    required_error: 'Please select a role', // Shows when field is missing
    invalid_type_error: 'Please select your role',
  }),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/signup', data);
      if (res.status === 201) {
        toast.success(
          'Account created successfully. Please check your email to verify or log in.'
        );
        router.push('/login');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.response?.data || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 w-full max-w-sm'
    >
      <h1 className='font-bold text-5xl mb-8 text-center hidden  lg:block'>
        Sign Up
      </h1>{' '}
      <SavedProgressNotification />
      <div className='space-y-2'>
        <Label
          htmlFor='username'
          className='block text-sm font-medium text-gray-700'
        >
          Username
        </Label>
        <Input
          id='username'
          type='text'
          {...register('username')}
          placeholder='Enter your username'
          className={`${
            errors.username
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
        />
        {errors.username && (
          <p className='text-sm text-red-500'>{errors.username.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <Label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </Label>
        <Input
          id='email'
          type='email'
          {...register('email')}
          placeholder='Enter your email'
          className={`${
            errors.email
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>
      <div className='space-y-2 relative'>
        <Label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          Password
        </Label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder='Enter your password'
            className={`${
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <Label className='block text-sm font-medium text-gray-700'>Role</Label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <input
              {...register('role')}
              type='radio'
              value='patient'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
            />
            <span>Patient</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input
              {...register('role')}
              type='radio'
              value='surgeon'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
            />
            <span>Surgeon</span>
          </label>
        </div>
        {/* {console.log('first role selected', errors?.role.message)} */}
        {errors.role && (
          <p className='text-sm text-red-500'>
            {' '}
            {errors.role.message || 'Please select a role'}
          </p>
        )}
      </div>
      <Button
        type='submit'
        className='w-full bg-blue-600 hover:bg-blue-500'
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignupForm;
