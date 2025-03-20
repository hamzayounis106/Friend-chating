// src/components/jobs/JobHeader.tsx
'use client';
import format from 'date-fns/format';
import { JSX } from 'react';
import { JobHeaderProps } from './job';

export default function JobHeader({
  title,
  type,
  date,
  status,
}: JobHeaderProps) {
  const formattedDate = format(new Date(date), 'PPP');

  // Define status configs for better organization
  const statusConfig: Record<
    'created' | 'scheduled' | 'closed',
    {
      bg: string;
      text: string;
      icon: JSX.Element;
      label: string;
    }
  > = {
    created: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: (
        <svg
          className='w-4 h-4 mr-1'
          viewBox='0 0 20 20'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      ),
      label: 'New',
    },
    scheduled: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: (
        <svg
          className='w-4 h-4 mr-1'
          viewBox='0 0 20 20'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
            clipRule='evenodd'
          />
        </svg>
      ),
      label: 'Scheduled',
    },
    closed: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      icon: (
        <svg
          className='w-4 h-4 mr-1'
          viewBox='0 0 20 20'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
            clipRule='evenodd'
          />
        </svg>
      ),
      label: 'Closed',
    },
  };
  type JobStatus = keyof typeof statusConfig;

  const currentStatus =
    statusConfig[status as JobStatus] || statusConfig.created;

  return (
    <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 shadow-md relative overflow-hidden'>
      <div className='absolute inset-0 bg-pattern opacity-10'></div>
      <div className='relative z-10'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
            <div className='mt-3 flex flex-wrap items-center gap-3'>
              <span className='bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full border border-white/30 shadow-sm flex items-center'>
                <svg
                  className='w-4 h-4 mr-1.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  ></path>
                </svg>
                {type}
              </span>
              <span className='text-blue-100 text-sm flex items-center'>
                <svg
                  className='w-4 h-4 mr-1.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  ></path>
                </svg>
                Posted: {formattedDate}
              </span>
            </div>
          </div>

          <div
            className={`${currentStatus.bg} ${currentStatus.text} px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm border border-opacity-20`}
          >
            {currentStatus.icon}
            {currentStatus.label}
          </div>
        </div>
      </div>
    </div>
  );
}
