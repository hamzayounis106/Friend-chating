// components/PusherJobHandler.tsx
'use client';
import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addJob } from '@/store/slices/jobSlice';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';

const PusherJobHandler = ({ email }: { email: string }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const channelKey = toPusherKey(`surgeon:${email}:jobs`);

    pusherClient.subscribe(channelKey);
    console.log('Subscribed to:', channelKey);

    const handler = (newJob: JobData) => {
      console.log('Received new job:', newJob);

      // Only add job if it's not already accepted by this surgeon
      const isPending = newJob.surgeonEmails.some(
        (s) => s.email === email && s.status === 'pending'
      );

      if (isPending) {
        dispatch(addJob({ email, job: newJob }));
      }
    };
    pusherClient.bind('new_job', handler);

    return () => {
      console.log('Unsubscribing from:', channelKey);
      pusherClient.unsubscribe(channelKey);
      pusherClient.unbind('new_job', handler);
    };
  }, [email, dispatch]);

  return null;
};
export default PusherJobHandler;
