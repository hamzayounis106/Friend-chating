// src/components/jobs/JobHeader.tsx
'use client';
import format from 'date-fns/format';
import { JobHeaderProps } from './job';

export default function JobHeader({
  title,
  type,
  date,
  status,
}: JobHeaderProps) {
  const formattedDate = format(new Date(date), 'PPP');

  return (
    <div className='bg-gradient-to-r from-blue-400 to-blue-500 text-white p-8'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold'>{title}</h1>
          <div className='mt-2 flex items-center'>
            <span className='bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mr-2'>
              {type}
            </span>
            <span className='text-blue-200 text-sm'>
              Posted: {formattedDate}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'created'
              ? 'bg-green-100 text-green-700'
              : status === 'in-progress'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {status === 'created'
            ? 'New'
            : status === 'in-progress'
            ? 'In Progress'
            : 'Completed'}
        </span>
      </div>
    </div>
  );
}
