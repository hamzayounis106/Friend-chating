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

export default function SingleJobPost({ jobData }: { jobData: JobData }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      session?.user?.role === 'patient' &&
      jobData?.patientId?._id !== session.user.id
    ) {
      router.push('/job-post');
    }
  }, [jobData, session, router]);

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

  if (status === 'loading' || loading) return <LoadingState />;
  if (error || !jobData) return <ErrorState error={error || 'Job not found'} />;
console.log(
  'jpbDatastatusssssssssssssss',jobData.status
)
  const isCreator = session?.user?.id === jobData.patientId?._id;
  const isSurgeon = session?.user?.role === 'surgeon';
  const isJobClosed = jobData.status === 'completed';

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

        {isCreator && jobData.surgeonEmails.length > 0 && (
          <SurgeonsList surgeons={jobData.surgeonEmails} />
        )}

        <JobActions
          isCreator={isCreator}
          isSurgeon={isSurgeon}
          isJobClosed={isJobClosed}
          jobId={jobData._id}
          onClose={() => confirm('Are you sure?') && router.push('/dashboard')}
          onReply={handleReply}
          onBack={() => router.back()}
        />

{isCreator &&     <OffersForSingleJobPost jobId={jobData._id} />
}      </div>
    </div>
  );
}
