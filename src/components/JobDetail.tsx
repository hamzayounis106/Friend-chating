'use client';

import { formatDate } from '@/lib/utils';
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
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { JobData } from './jobs/job';

interface JobDetailProps {
  jobs: JobData[];
  userEmail: string;
}

const JobDetail: FC<JobDetailProps> = ({ jobs: initialJobs, userEmail }) => {
  console.log('chacke the initial jobs from  😂😂😂😂😂😂', initialJobs);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectJobsMemoized = useMemo(
    () => selectJobsBySurgeon(userEmail),
    [userEmail]
  );
  const jobs = useAppSelector(selectJobsMemoized);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');

  const toggleAttachments = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const session = useSession();
  const sessionId = session.data?.user.id;
  const navigate = useRouter();

  const acceptJob = async (jobId: string) => {
    try {
      const res = await axios.post('/api/Jobs/accept', {
        id: jobId,
        userEmail,
      });
      dispatch(removeAcceptedJob({ email: userEmail, jobId }));
      dispatch(decrementUnseenJobCount({ email: userEmail }));
      const job = res.data.job;

      toast.success('Job accepted successfully!');
      navigate.push(
        `/dashboard/chat/${sessionId}--${job.patientId}--${job?._id}`
      );
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

  const pendingJobs = jobs?.filter((job) =>
    job.surgeonEmails.some(
      (emailObj) =>
        emailObj.email === userEmail && emailObj.status === 'pending'
    )
  );
  const acceptedJobs = jobs?.filter((job) =>
    job.surgeonEmails.some(
      (emailObj) =>
        emailObj.email === userEmail && emailObj.status === 'accepted'
    )
  );
  const renderJobCard = (job: JobData, index: number) => {
    const words = job.description.split(' ');
    const isTruncated = words.length > 12;
    const shortDescription =
      words.slice(0, 12).join(' ') + (isTruncated ? '...' : '');

    return (
      <div
        key={index}
        className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-300 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full'
      >
        {/* Job header */}
        <div className='flex items-center justify-between  p-5 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-gray-300'>
          <Link
            href={`/job-post/${job._id.toString()}`}
            className='text-lg font-semibold text-blue-600 hover:underline transition'
          >
            {job.title}
          </Link>
          <span className='flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-white rounded-full border border-gray-300 shadow-sm'>
            Created At
            <Clock className='w-4 h-4 text-blue-500' />
            {formatDate(job?.createdAt) || 'No format match'}
          </span>
        </div>

        {/* Job details - This will grow to fill space */}
        <div className='p-5 space-y-3 flex-grow flex flex-col justify-between'>
          <p className='text-gray-700 text-sm'>
            {shortDescription}{' '}
            {isTruncated && (
              <Link
                href={`/job-post/${job._id.toString()}`}
                className='text-blue-500 font-medium hover:underline'
              >
                See More
              </Link>
            )}
          </p>

          {/* Location */}
          <div className=''>
            <h3 className='font-medium text-gray-800'>Preferred Location:</h3>
            <ul className='list-disc list-inside text-sm text-gray-600 flex flex-col items-start   '>
              {job?.location?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className='flex flex-wrap  gap-2'>
            <span className='px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md shadow-sm'>
              {job.type}
            </span>
            <span className='px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md shadow-sm'>
              Expected Date &nbsp;
              {formatDate(job.date)}
            </span>
            {job?.AttachmentUrls?.length > 0 && (
              <span className='px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-md shadow-sm flex items-center'>
                <FileText className='w-4 h-4 mr-1' />
                {job.AttachmentUrls.length} Attachments
              </span>
            )}
          </div>

          {/* Attachments Toggle Button */}
          {job?.AttachmentUrls?.length > 0 && (
            <button
              onClick={() => toggleAttachments(job._id)}
              className='w-full py-2 px-4 mt-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center'
            >
              {expandedJobId === job._id ? (
                <>
                  <ChevronUp className='w-4 h-4 mr-2' /> Hide Attachments
                </>
              ) : (
                <>
                  <ChevronDown className='w-4 h-4 mr-2' /> View Attachments
                </>
              )}
            </button>
          )}

          {/* Attachments Section */}
          {expandedJobId === job._id && (
            <div className='mt-4 grid grid-cols-2 gap-4'>
              {job.AttachmentUrls.map((url, idx) => {
                const isVideo =
                  url.toLowerCase().endsWith('.mp4') ||
                  url.toLowerCase().endsWith('.webm');

                return (
                  <div
                    key={idx}
                    className='relative h-56 bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all'
                  >
                    {isVideo ? (
                      <video
                        src={url}
                        controls
                        className='object-cover w-full h-full cursor-pointer'
                        onClick={() => window.open(url, '_blank')}
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        fill
                        sizes='(max-width: 48px) 100vw'
                        className='object-cover cursor-pointer hover:scale-105 transition-transform duration-300'
                        onClick={() => window.open(url, '_blank')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className='p-5 border-t border-gray-300 bg-gray-100 flex '>
          {activeTab === 'pending' ? (
            job.status === 'scheduled' ? (
              <p className='text-center text-gray-500 py-2'>
                Someone else is hired before your reply.
              </p>
            ) : (
              <button
                onClick={() => acceptJob(job._id)}
                className='w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg flex items-center justify-center transition-all'
              >
                <MessageCircle className='w-4 h-4 mr-2' /> Reply to Request
              </button>
            )
          ) : (
            <Link
              href={`/dashboard/chat/${sessionId}--${job.patientId}--${job?._id}`}
              className='w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg flex items-center justify-center transition-all'
            >
              <MessageCircle className='w-4 h-4 mr-2' /> Visit Chat
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Tabs */}
      <div className='flex border-b border-gray-200'>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'pending'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } transition-colors`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests ({pendingJobs?.length || 0})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'accepted'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } transition-colors`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Jobs ({acceptedJobs?.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        <>
          {pendingJobs?.length === 0 ? (
            <div className='text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
              <div className='mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4'>
                <Calendar className='w-6 h-6 text-blue-500' />
              </div>
              <h3 className='text-gray-800 font-medium mb-1'>
                No pending requests
              </h3>
              <p className='text-sm text-gray-500'>
                You don&apos;t have any new job requests at the moment.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1  lg:grid-cols-2 gap-6'>
              {pendingJobs?.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </>
      ) : (
        <>
          {acceptedJobs?.length === 0 ? (
            <div className='text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
              <div className='mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4'>
                <Check className='w-6 h-6 text-green-500' />
              </div>
              <h3 className='text-gray-800 font-medium mb-1'>
                No accepted jobs
              </h3>
              <p className='text-sm text-gray-500'>
                You haven&apos;t accepted any job requests yet.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
              {acceptedJobs?.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobDetail;
