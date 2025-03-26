'use client';
import { useSession } from 'next-auth/react';
import ToastProvider from '@/components/ToastProvider';
import PusherJobHandler from '../PusherJobHandler';
import JobToastWrapper from './JobToastWrapper';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { clearNewJobs } from '@/store/slices/jobSlice';
import { usePathname } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import { Toaster } from '../ui/toaster';
import Footer from '../home/Footer';
const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userEmail = session?.user?.email;

  const pathname = usePathname();

  const showNavbar = !pathname?.startsWith('/dashboard');
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
      {showNavbar && <Navbar />}
      <Toaster />
      {children}
      {showNavbar && <Footer />}
    </>
  );
};

export default SessionWrapper;
