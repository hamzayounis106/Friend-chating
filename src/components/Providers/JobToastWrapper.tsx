'use client';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';
import JobToast from '../toasts/JobToast';

const JobToastWrapper = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // Get the latest job
  const latestJob = useAppSelector((state) =>
    userEmail ? state.jobs.latestJobsBySurgeon[userEmail] : null
  );

  useEffect(() => {
    if (latestJob) {
      toast.custom((t) => <JobToast t={t} job={latestJob} />, {
        duration: 5000, // Stays visible for 5 seconds
      });
    }
  }, [latestJob]); // Only trigger when a new job arrives

  return null;
};

export default JobToastWrapper;
