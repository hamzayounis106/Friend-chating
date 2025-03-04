'use client';

import { useSession } from 'next-auth/react';
import ToastProvider from '@/components/ToastProvider';

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const sessionId = session?.user?.id || '';

  return (
    <>
      {sessionId && <ToastProvider sessionId={sessionId} />}
      {children}
    </>
  );
};

export default SessionWrapper;
