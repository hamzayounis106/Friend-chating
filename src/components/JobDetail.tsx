'use client';

import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
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
    return (
      <div
        key={index}
        className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'
      >
        {/* Job header with title and date */}
        <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200'>
          <Link href={`/job-post/${job._id.toString()}`}>
            <span className='font-bold text-lg text-blue-500 underline'>
              {job.title}
            </span>
          </Link>

          <span className='px-3 py-1 bg-white text-xs font-medium text-gray-700 rounded-full border border-gray-200 flex items-center'>
            <Clock className='w-3 h-3 mr-1 text-blue-500' />
            {formatDate(job.date)}
          </span>
        </div>

        {/* Job details */}
        <div className='p-4'>
          {/* Description */}
          <p className='text-gray-600 mb-4 line-clamp-2'>{job.description}</p>

          <h1>
            Preffered Location by Patient
            {job?.location?.map((item) => {
              return <li key={item}>{item}</li>;
            })}
          </h1>

          {/* Tags and metadata */}
          <div className='flex flex-wrap gap-2 mb-4'>
            <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md'>
              {job.type}
            </span>
            {job?.AttachmentUrls?.length > 0 && (
              <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md flex items-center'>
                <FileText className='w-3 h-3 mr-1' />
                {job.AttachmentUrls.length} Attachments
              </span>
            )}
          </div>

          {/* Attachments Toggle Button */}
          {job?.AttachmentUrls?.length > 0 && (
            <button
              onClick={() => toggleAttachments(job._id)}
              className='w-full mt-2 px-4 py-2 flex items-center justify-center text-sm border border-gray-200 hover:bg-gray-50 rounded-md transition'
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
            <div className='mt-4 transition-all duration-300 ease-in-out'>
              <div className='grid grid-cols-2  gap-4'>
                {job.AttachmentUrls.map((url, idx) => {
                  const isVideo =
                    url.toLowerCase().endsWith('.mp4') ||
                    url.toLowerCase().endsWith('.webm');

                  return (
                    <div
                      key={idx}
                      className='relative h-64 bg-gray-100 rounded-lg overflow-hidden shadow-md'
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
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          className='object-cover cursor-pointer transition-transform duration-300 hover:scale-105'
                          onClick={() => window.open(url, '_blank')}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className='p-4 border-t border-gray-200 bg-gray-50'>
          {activeTab === 'pending' ? (
            job.status === 'scheduled' ? (
              <p className='text-center text-gray-500 py-1'>
                Someone else is hired before your reply.{' '}
              </p>
            ) : (
              <button
                onClick={() => acceptJob(job._id)}
                className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center'
              >
                <MessageCircle className='w-4 h-4 mr-2' /> Reply to Request
              </button>
            )
          ) : (
            <Link
              href={`/dashboard/chat/${sessionId}--${job.patientId}--${job?._id}`}
              className='w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center justify-center'
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {acceptedJobs?.map((job, index) => renderJobCard(job, index))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobDetail;
