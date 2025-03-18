'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import format from 'date-fns/format';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SingleJobPost({ jobData }: { jobData: JobData }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (
        session.user.role === 'patient' &&
        jobData?.patientId?._id !== session.user.id
      ) {
        console.log('you have not created this post ');
        router.push('/job-post');
      }
    }
  }, [jobData, session, router]);
  const handleReplyToJob = async () => {
    setLoading(true);
    try {
      const currentUserEmail = session?.user?.email;
      
      if (!currentUserEmail) {
        toast.error("You must be logged in");
        return;
      }
      
      // Check if user has already accepted this job
      const isAccepted = jobData.surgeonEmails.some(
        (surgeon) => surgeon.email === currentUserEmail && surgeon.status === 'accepted'
      );
  
      if (isAccepted) {
        // User already accepted, just navigate to chat
        console.log('Already accepted this job, navigating to chat');
        router.push(
          `/dashboard/chat/${session?.user?.id}--${jobData.patientId?._id}--${jobData._id}`
        );
        return;
      }
      
      // Check if user is invited but hasn't accepted yet
      const isPendingInvitation = jobData.surgeonEmails.some(
        (surgeon) => surgeon.email === currentUserEmail && surgeon.status === 'pending'
      );
  
      if (isPendingInvitation) {
        console.log('Found pending invitation, accepting it');
        
        // Accept the invitation
        const acceptRes = await axios.post('/api/Jobs/accept', {
          id: jobId,
          currentUserEmail,
        });
        
        if (acceptRes.status !== 200) {
          toast.error('Failed to accept invitation');
          return;
        }
        
        // Successfully accepted, now navigate to chat
        console.log('Successfully accepted invitation');
        router.push(
          `/dashboard/chat/${session?.user?.id}--${jobData.patientId?._id}--${jobData._id}`
        );
        return;
      }
      
      // Not invited yet, send an invite to self
      console.log('Not invited yet, sending invitation');
      const inviteRes = await axios.post('/api/Jobs/send-invite', {
        id: jobId,
        currentUserEmail,
      });
      
      if (inviteRes.status !== 200) {
        toast.error('Failed to send invitation');
        return;
      }
      
      // Now accept the invitation we just sent
      console.log('Invitation sent, now accepting it');
      const acceptRes = await axios.post('/api/Jobs/accept', {
        id: jobId,
        currentUserEmail,
      });
      
      if (acceptRes.status !== 200) {
        toast.error('Failed to accept invitation');
        return;
      }
      
      // Successfully sent and accepted invitation, navigate to chat
      console.log('Successfully sent and accepted invitation');
      router.push(
        `/dashboard/chat/${session?.user?.id}--${jobData.patientId?._id}--${jobData._id}`
      );
      
    } catch (error) {
      console.error('Error in handleReplyToJob:', error);
      toast.error('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500'></div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
        <h2 className='text-3xl font-semibold text-red-600 mb-4'>
          {error || 'Job not found'}
        </h2>
        <button
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
          onClick={() => router.push('/')}
        >
          Return to Home
        </button>
      </div>
    );
  }
  console.log('job post data for single', jobData);

  const isCreator = session?.user?.id === jobData.patientId?._id;
  const isSurgeon = session?.user?.role === 'surgeon';
  const formattedDate = jobData.date
    ? format(new Date(jobData.date), 'PPP')
    : 'Not specified';
  const jobId = jobData._id;
  const isJobClosed = jobData.status === 'completed';
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-400 to-blue-500 text-white p-8'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold'>{jobData.title}</h1>
              <div className='mt-2 flex items-center'>
                <span className='bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mr-2'>
                  {jobData.type}
                </span>
                <span className='text-blue-200 text-sm'>
                  Posted: {formattedDate}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium
                ${
                  jobData.status === 'created'
                    ? 'bg-green-100 text-green-700'
                    : jobData.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }
              `}
            >
              {jobData.status === 'created'
                ? 'New'
                : jobData.status === 'in-progress'
                ? 'In Progress'
                : 'Completed'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className='p-8 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
              Description
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              {jobData.description}
            </p>
          </div>

          {jobData.AttachmentUrls && jobData.AttachmentUrls.length > 0 && (
            <div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                Attachments
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {jobData.AttachmentUrls.map((url, idx) => {
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

          <hr className='border-gray-200' />

          <div>
            <h3 className='text-xl font-semibold text-gray-800 mb-3'>
              Patient Information
            </h3>
            <div className='flex items-center space-x-6'>
              {jobData.patientId?.image && (
                <div className='relative w-16 h-16 rounded-full overflow-hidden shadow-md'>
                  <Image
                    src={jobData.patientId.image}
                    alt={jobData.patientId.name || 'Patient'}
                    fill
                    sizes='64px'
                    className='object-cover'
                  />
                </div>
              )}
              <div>
                <p className='text-lg font-medium text-gray-800'>
                  {jobData.patientId?.name || 'Anonymous Patient'}
                </p>
                {isCreator && (
                  <p className='text-gray-500'>{jobData.patientId?.email}</p>
                )}
              </div>
            </div>
          </div>

          {jobData.surgeonEmails &&
            jobData.surgeonEmails.length > 0 &&
            isCreator && (
              <div>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                  Invited Surgeons
                </h3>
                <ul className='list-disc pl-6 space-y-2'>
                  {jobData.surgeonEmails.map((surgeon, idx) => (
                    <li key={idx} className='text-gray-700'>
                      {surgeon.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 p-8 border-t border-gray-200 flex justify-end gap-4'>
          {/* Patient who created the job */}
          {isCreator && (
            <>
              {/* <button
                className='px-5 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200'
                onClick={() => router.push(`/job-post/${jobId}/edit`)}
              >
                Edit Job
              </button> */}
              <button
                className='px-5 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200'
                onClick={() => {
                  if (confirm('Are you sure you want to delete this job?')) {
                    router.push('/dashboard');
                  }
                }}
              >
                Close Job
              </button>
            </>
          )}

          {/* Surgeon viewing the job */}
          {isSurgeon && !isJobClosed && (
            <button
              className='px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200'
              onClick={handleReplyToJob}
            >
              Reply to Job Post
            </button>
          )}
          {isJobClosed && (
            <p className='text-gray-500 text-sm'>
              This job is closed for new applications
            </p>
          )}
          {!session && (
            <p className='text-gray-500 text-sm'>
              Login as a surgeon to reply to the job
            </p>
          )}

          <button
            className='px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200'
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
