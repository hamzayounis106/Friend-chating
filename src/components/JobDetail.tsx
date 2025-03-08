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
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

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

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const toggleAttachments = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };
  const session = useSession();
  const sessionId = session.data?.user.id;
  const navigate = useRouter();
  const acceptJob = async (jobId: string) => {
    try {
 const res =      await axios.post('/api/Jobs/accept', { id: jobId, userEmail });
      dispatch(removeAcceptedJob({ email: userEmail, jobId }));
      dispatch(decrementUnseenJobCount({ email: userEmail }));
      console.log("res on invite accept",res)
      const job = res.data.job;
      
 navigate.push(`/dashboard/chat/${sessionId}--${job.patientId}--${job?._id}`);
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
                className='flex flex-col gap-4 p-4 border rounded-md shadow-md bg-white'
              >
                <h3 className='font-bold text-lg'>{job.title}</h3>
                <p className='text-sm text-gray-600'>{job.description}</p>
                <p className='text-xs text-gray-500'>
                  Type: {job.type} | Date:{' '}
                  {new Date(job.date).toLocaleDateString()}
                </p>

                {/* See More Button */}
                {job?.AttachmentUrls?.length > 0 && (
                  <button
                    onClick={() => toggleAttachments(job._id)}
                    className='mt-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition w-40'
                  >
                    {expandedJobId === job._id ? 'See Less' : 'See More'}
                  </button>
                )}

                {/* Attachments Section */}
                {expandedJobId === job._id && (
                  <div className='mt-4 transition-all duration-300 ease-in-out'>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                      {job?.AttachmentUrls?.map((url: string, i: number) => (
                        <div
                          key={i}
                          className='relative group overflow-hidden rounded-lg shadow-lg'
                        >
                          {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                            <video
                              src={url}
                              controls
                              className='h-40 w-60 object-cover rounded-lg transition-transform duration-300 hover:scale-105'
                            />
                          ) : (
                            <Image
                              src={url}
                              alt='Attachment'
                              width={240} // ✅ Required for Next.js Image
                              height={160} // ✅ Required for Next.js Image
                              className='object-cover rounded-lg transition-transform duration-300 hover:scale-105'
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accept Job Button */}
                <div className='flex gap-2'>
                  <button
                    onClick={() => acceptJob(job._id)}
                    aria-label='accept job'
                    className='w-8 h-8 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md'
                  > Reply -
                    {/* <Check className='font-semibold text-white w-3/4 h-3/4' /> */}
                  </button>
                </div>
              </div>
            )
        )
      )}

      {/* Accepted Jobs */}
      {jobs?.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        <>
          <p className='mt-6 font-semibold text-lg'>Accepted Jobs</p>
          {jobs?.map(
            (job, index) =>
              job.surgeonEmails.some(
                (emailObj) =>
                  emailObj.email === userEmail && emailObj.status === 'accepted'
              ) && (
                <div
                  key={index}
                  className='flex flex-col gap-4 p-4 border rounded-md shadow-md bg-white'
                >
                  <h3 className='font-bold text-lg'>{job.title}</h3>
                  <p className='text-sm text-gray-600'>{job.description}</p>
                  <p className='text-xs text-gray-500'>
                    Type: {job.type} | Date:{' '}
                    {new Date(job.date).toLocaleDateString()}
                  </p>
                  {/* See More Button */}
                  {job?.AttachmentUrls?.length > 0 && (
                    <button
                      onClick={() => toggleAttachments(job._id)}
                      className='mt-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition w-40'
                    >
                      {expandedJobId === job._id ? 'See Less' : 'See More'}
                    </button>
                  )}

                  {/* Attachments Section */}
                  {expandedJobId === job._id && (
                    <div className='mt-4 transition-all duration-300 ease-in-out'>
                      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {job?.AttachmentUrls?.map((url: string, i: number) => (
                          <div
                            key={i}
                            className='relative group overflow-hidden rounded-lg shadow-lg'
                          >
                            {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                              <video
                                src={url}
                                controls
                                className='h-40 w-60 object-cover rounded-lg transition-transform duration-300 hover:scale-105'
                              />
                            ) : (
                              <Image
                                src={url}
                                alt='Attachment'
                                width={240} // ✅ Required for Next.js Image
                                height={160} // ✅ Required for Next.js Image
                                className='object-cover rounded-lg transition-transform duration-300 hover:scale-105'
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/dashboard/chat/${sessionId}--${job.patientId}--${job?._id}`}
                  >
                    Visit Chat
                  </Link>
                </div>
              )
          )}
        </>
      )}
    </>
  );
};

export default JobDetail;
