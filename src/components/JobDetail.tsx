'use client';

import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // ✅ Import toast
interface JobDetailProps {
  jobs: JobData[];
  userEmail: string;
}

const JobDetail: FC<JobDetailProps> = ({ jobs, userEmail }) => {
  console.log('Jobs:', jobs);
  const router = useRouter();
  const [jobList, setJobList] = useState<JobData[]>(jobs);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`surgeon:${userEmail}:jobs`));

    const jobHandler = (newJob: JobData) => {
      console.log('New job received:', newJob);
      setJobList((prev) => [...prev, newJob]);

      // ✅ Show toast notification
      toast.success(`New job assigned: ${newJob.title}`, {
        position: 'top-right',
      });
    };

    pusherClient.bind('new_job', jobHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`surgeon:${userEmail}:jobs`));
      pusherClient.unbind('new_job', jobHandler);
    };
  }, [userEmail]);

  // Handle accepting a job
  const acceptJob = async (jobId: string) => {
    try {
      await axios.post('/api/Jobs/accept', { id: jobId });
      setJobList((prev) =>
        prev.filter((job) => job._id !== jobId)
      );

      // Refresh the page to reflect changes
      router.refresh();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error('Error accepting job');
    }
  };
  return (
    <>
      {jobList.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        jobList.map((job, index) => (
          job.surgeonEmails.some(emailObj => emailObj.email === userEmail && emailObj.status === 'pending') && (
            <div
              key={index}
              className='flex flex-col gap-4 p-4 border rounded-md'
            >
              <h3 className='font-bold text-lg'>{job.title}</h3>
              <p className='text-sm text-gray-600'>{job.description}</p>
              <p className='text-xs text-gray-500'>
                Type: {job.type} | Date: {new Date(job.date).toLocaleDateString()}
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => acceptJob(job._id)}
                  aria-label='accept job'
                  className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'
                >
                  <Check className='font-semibold text-white w-3/4 h-3/4' />
                </button>
              </div>
            </div>
          )
        ))
      )}

      {/* for accepted */}
      {jobList.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        jobList.map((job, index) => (
          job.surgeonEmails.some(emailObj => emailObj.email === userEmail && emailObj.status === 'accepted') && (
            <div
              key={index}
              className='flex flex-col gap-4 p-4 border rounded-md'
            >
              <h3 className='font-bold text-lg'>{job.title}</h3>
              <p className='text-sm text-gray-600'>{job.description}</p>
              <p className='text-xs text-gray-500'>
                Type: {job.type} | Date: {new Date(job.date).toLocaleDateString()}
              </p>
            </div>
          )
        ))
      )}
    </>
  );
};

export default JobDetail;