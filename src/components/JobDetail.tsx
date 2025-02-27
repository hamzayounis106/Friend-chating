'use client';

import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // ✅ Import toast

export interface Job {
  title: string;
  type: string;
  date: string;
  description: string;
  surgeonEmails: string[];
  videoURLs: string[];
  createdBy: string;
  patientId: string;
}

interface JobDetailProps {
  jobs: Job[];
  userEmail: string;
}

const JobDetail: FC<JobDetailProps> = ({ jobs, userEmail }) => {
  const router = useRouter();
  const [jobList, setJobList] = useState<Job[]>(jobs);

  useEffect(() => {
    // console.log(
    //   'Subscribing to Pusher channel:',
    //   toPusherKey(`surgeon:${userEmail}:jobs`)
    // );
    pusherClient.subscribe(toPusherKey(`surgeon:${userEmail}:jobs`));

    const jobHandler = (newJob: Job) => {
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

  return (
    <>
      {jobList.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        jobList.map((job, index) => (
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
        ))
      )}
    </>
  );
};

export default JobDetail;
