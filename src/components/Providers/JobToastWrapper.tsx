'use client';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';

const JobToastWrapper = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const { newJobIdsBySurgeon } = useAppSelector((state) => state.jobs);

  // Get new jobs for current user only
  const newJobs = userEmail ? newJobIdsBySurgeon[userEmail] || [] : [];

  useEffect(() => {
    if (newJobs.length > 0) {
      toast.success(`New job assignment received!`, {
        position: 'top-right',
        icon: '📨',
      });
    }
  }, [newJobs.length]); // Only trigger for current user's new jobs

  return null;
};

export default JobToastWrapper;
