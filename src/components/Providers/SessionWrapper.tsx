'use client';

import { useSession } from 'next-auth/react';
import ToastProvider from '@/components/ToastProvider';

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <>
      {session && <ToastProvider session={session} />}{' '}
      {/* ✅ Global toast handler */}
      {children}
    </>
  );
};

export default SessionWrapper;
