'use client';
import { useSession } from 'next-auth/react';
import ToastProvider from '@/components/ToastProvider';
import PusherJobHandler from '../PusherJobHandler';
import JobToastWrapper from './JobToastWrapper';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { clearNewJobs } from '@/store/slices/jobSlice';

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userEmail = session?.user?.email;

  useEffect(() => {
    return () => {
      if (userEmail) {
        dispatch(clearNewJobs({ email: userEmail }));
      }
    };
  }, [dispatch, userEmail]);

  return (
    <>
      {session && <ToastProvider session={session} />}
      {userEmail && <PusherJobHandler email={userEmail} />}
      <JobToastWrapper />
      {children}
    </>
  );
};

export default SessionWrapper;
