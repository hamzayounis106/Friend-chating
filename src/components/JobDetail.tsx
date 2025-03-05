'use client';

import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import {
  selectJobsBySurgeon,
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';
import {
  addJobSilent,
  decrementUnseenJobCount,
  removeAcceptedJob,
  setInitialJobs,
} from '@/store/slices/jobSlice';
import axios from 'axios';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast'; // ✅ Import toast
interface JobDetailProps {
  jobs: JobData[];
  userEmail: string;
}

const JobDetail: FC<JobDetailProps> = ({ jobs: initialJobs, userEmail }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectJobsMemoized = useMemo(
    () => selectJobsBySurgeon(userEmail),
    [userEmail]
  );
  const jobs = useAppSelector(selectJobsMemoized);
  const acceptJob = async (jobId: string) => {
    try {
      await axios.post('/api/Jobs/accept', { id: jobId, userEmail });
      dispatch(removeAcceptedJob({ email: userEmail, jobId }));
      dispatch(decrementUnseenJobCount({ email: userEmail }));

      router.refresh();
    } catch (error) {
      toast.error('Error accepting job');
    }
  };
  useEffect(() => {
    // Initialize user-specific jobs
    dispatch(
      setInitialJobs({
        email: userEmail,
        jobs: initialJobs,
      })
    );

    // Add jobs silently for current user
    initialJobs.forEach((job) => {
      dispatch(addJobSilent(userEmail, job));
    });
  }, [initialJobs, userEmail, dispatch]);
  return (
    <>
      {jobs?.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        jobs?.map(
          (job, index) =>
            job.surgeonEmails.some(
              (emailObj) =>
                emailObj.email === userEmail && emailObj.status === 'pending'
            ) && (
              <div
                key={index}
                className='flex flex-col gap-4 p-4 border rounded-md'
              >
                <h3 className='font-bold text-lg'>{job.title}</h3>
                <p className='text-sm text-gray-600'>{job.description}</p>
                <p className='text-xs text-gray-500'>
                  Type: {job.type} | Date:{' '}
                  {new Date(job.date).toLocaleDateString()}
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
        )
      )}

      {/* for accepted */}
      {jobs?.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        <>
          <>Accepted jobs offer</>
          {jobs?.map(
            (job, index) =>
              job.surgeonEmails.some(
                (emailObj) =>
                  emailObj.email === userEmail && emailObj.status === 'accepted'
              ) && (
                <div
                  key={index}
                  className='flex flex-col gap-4 p-4 border rounded-md'
                >
                  <h3 className='font-bold text-lg'>{job.title}</h3>
                  <p className='text-sm text-gray-600'>{job.description}</p>
                  <p className='text-xs text-gray-500'>
                    Type: {job.type} | Date:{' '}
                    {new Date(job.date).toLocaleDateString()}
                  </p>
                </div>
              )
          )}
        </>
      )}
    </>
  );
};

export default JobDetail;
