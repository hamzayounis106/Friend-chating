'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import JobHeader from './JobHeader';
import JobContent from './JobContent';
import PatientInfo from './PatientInfo';
import SurgeonsList from './SurgeonsList';
import JobActions from './JobActions';

import { JobData } from './job';
import LoadingState, { ErrorState } from './LoadingState';
import OffersForSingleJobPost from './OffersForSingleJobPost';
import SurgeonLoginPrompt from './SurgeonLoginPrompt';
import EmailInviteForm from './EmailInviteForm';

export default function SingleJobPost({ jobData }: { jobData: JobData }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (
  //     session?.user?.role === 'patient' &&
  //     jobData?.patientId?._id !== session.user.id
  //   ) {

  //   }
  // }, [jobData, session, router]);

  const handleReply = async () => {
    setLoading(true);
    try {
      const currentUserEmail = session?.user?.email;
      if (!currentUserEmail) {
        toast.error('You must be logged in');
        return;
      }

      const isAccepted = jobData.surgeonEmails.some(
        (s) => s.email === currentUserEmail && s.status === 'accepted'
      );

      if (isAccepted) {
        router.push(
          `/dashboard/chat/${session.user?.id}--${jobData.patientId?._id}--${jobData._id}`
        );
        return;
      }

      const response = await handleInvitationFlow(currentUserEmail);
      if (response) {
        router.push(
          `/dashboard/chat/${session.user?.id}--${jobData.patientId?._id}--${jobData._id}`
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationFlow = async (email: string) => {
    const isPending = jobData.surgeonEmails.some(
      (s) => s.email === email && s.status === 'pending'
    );

    if (isPending) {
      await axios.post('/api/Jobs/accept', {
        id: jobData._id,
        currentUserEmail: email,
      });
      return true;
    }

    await axios.post('/api/Jobs/send-invite', {
      id: jobData._id,
      currentUserEmail: email,
    });
    await axios.post('/api/Jobs/accept', {
      id: jobData._id,
      currentUserEmail: email,
    });
    return true;
  };

  // New function to handle sending email invitations
  //   const handleSendInvites = () => {
  //     // Create the job URL - adjust as needed for your domain
  //     const jobUrl = `${window.location.origin}/job-post/${jobData._id}`;

  //     // Create email subject and body
  //     const subject = `Invitation to a Cosmetic Surgery Job`;
  //     const body = `
  // Hello,

  // I'd like to invite you to review a cosmetic surgery job on Secure Cosmetic.

  // Job Title: ${jobData.title}
  // Job Type: ${jobData.type}
  // Date: ${new Date(jobData.date).toLocaleDateString()}

  // To view the job details and submit an offer, please visit:
  // ${jobUrl}

  // Best regards,
  // ${session?.user?.name || 'A Secure Cosmetic User'}
  //     `;

  //     // Open the mailto link
  //     window.open(
  //       `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
  //         body
  //       )}`
  //     );
  //   };

  if (status === 'loading' || loading) return <LoadingState />;
  if (error || !jobData) return <ErrorState error={error || 'Job not found'} />;
  console.log('jpbDatastatusssssssssssssss', jobData.status);
  const isCreator = session?.user?.id === jobData.patientId?._id;
  const isSurgeon = session?.user?.role === 'surgeon';
  const isJobClosed = jobData.status === 'completed';

  const handleClose = () => {
    router.push('/dashboard');
  };
  if (!session?.user) {
    return <SurgeonLoginPrompt />;
  }
  if (
    session?.user.role === 'patient' &&
    session.user.id !== jobData.patientId?._id
  ) {
    return <SurgeonLoginPrompt />;
  }
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden'>
        <JobHeader
          title={jobData.title}
          type={jobData.type}
          date={jobData.date}
          status={jobData.status}
        />
        <JobContent
          description={jobData.description}
          attachments={jobData.AttachmentUrls}
        />
        <hr className='border-gray-200' />
        <PatientInfo patient={jobData.patientId} isCreator={isCreator} />

        {/* Show the surgeons list and invite button */}
        {isCreator && jobData.status !== 'closed' && (
          <div className='p-6 border-b border-gray-200'>
            <div className='mb-4 flex justify-between items-center'>
              {/* <h3 className='text-xl font-semibold text-gray-800'>
                Invited Surgeons
              </h3> */}
              {/* <button
                onClick={handleSendInvites}
                className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                </svg>
                Invite More Surgeons
              </button> */}
              <EmailInviteForm
                jobData={{
                  _id: jobData._id,
                  title: jobData.title,
                  type: jobData.type,
                  date: jobData.date,
                }}
                userEmail={session?.user?.email || ''}
                userName={session?.user?.name || ''}
              />
            </div>

            {jobData.surgeonEmails.length > 0 ? (
              <SurgeonsList surgeons={jobData.surgeonEmails} />
            ) : (
              <p className='text-gray-500'>
                No surgeons have been invited yet.
              </p>
            )}
          </div>
        )}

        {jobData.status !== 'closed' && (
          <JobActions
            isCreator={isCreator}
            isSurgeon={isSurgeon}
            isJobClosed={isJobClosed}
            jobId={jobData._id}
            onClose={handleClose}
            onReply={handleReply}
            onBack={() => router.back()}
          />
        )}

        {isCreator && jobData.status !== 'closed' && (
          <OffersForSingleJobPost jobId={jobData._id} />
        )}
      </div>
    </div>
  );
}
