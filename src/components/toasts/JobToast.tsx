import { FC } from 'react';
import { toast, type Toast } from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface JobToastProps {
  t: Toast;
  job: {
    _id: string;
    title: string;
    type: string;
    date: string;
    description: string;
    createdBy: string;
  };
}

const JobToast: FC<JobToastProps> = ({ t, job }) => {
  return (
    <div
      className={cn(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
        { 'animate-enter': t.visible, 'animate-leave': !t.visible }
      )}
    >
      <Link
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/requests`}
        prefetch={false}
        className='flex-1 w-0 p-4'
      >
        <div className='flex items-start'>
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>
              New Job Available
            </p>
            <p className='mt-1 text-sm text-gray-500 font-semibold'>
              {job?.title}
            </p>
            <p className='mt-1 text-xs text-gray-500'>Type: {job?.type}</p>
            <p className='mt-1 text-xs text-gray-500'>
              Date: {new Date(job?.date).toLocaleDateString()}
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              Created by: {job?.createdBy}
            </p>
            <p className='mt-1 text-xs text-gray-500'>
              Description: {job?.description}
            </p>
          </div>
        </div>
      </Link>

      <div className='flex border-l border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JobToast;
