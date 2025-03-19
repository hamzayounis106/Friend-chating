// 'use client';
// import { useEffect } from 'react';
// import { pusherClient } from '@/lib/pusher';
// import { toPusherKey } from '@/lib/utils';
// import { useAppDispatch } from '@/store/hooks';
// import { setLatestJob } from '@/store/slices/jobSlice';
// import { JobData } from '@/app/(dashboard)/dashboard/requests/page';

// const PusherJobHandler = ({ email }: { email: string }) => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const channelKey = toPusherKey(`surgeon:${email}:jobs`);

//     pusherClient.subscribe(channelKey);
//     console.log('Subscribed to:', channelKey);

//     const handler = (newJob: JobData) => {
//       console.log('Received new job:', newJob);

//       // Check if the job is still pending for this surgeon
//       const isPending = newJob.surgeonEmails.some(
//         (s) => s.email === email && s.status === 'pending'
//       );

//       if (isPending) {
//         dispatch(setLatestJob({ email, job: newJob })); // Only store the last job
//       }
//     };

//     pusherClient.bind('new_job', handler);

//     return () => {
//       console.log('Unsubscribing from:', channelKey);
//       pusherClient.unsubscribe(channelKey);
//       pusherClient.unbind('new_job', handler);
//     };
//   }, [email, dispatch]);

//   return null;
// };

// export default PusherJobHandler;

'use client';
import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { setLatestJob, addJob } from '@/store/slices/jobSlice';
import { JobData } from './jobs/job';

const PusherJobHandler = ({ email }: { email: string }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const channelKey = toPusherKey(`surgeon:${email}:jobs`);
    pusherClient.subscribe(channelKey);
    console.log('Subscribed to:', channelKey);

    const handler = (newJob: JobData) => {
      console.log('Received new job:', newJob);

      // Check if the job is still pending for this surgeon
      const isPending = newJob.surgeonEmails.some(
        (s) => s.email === email && s.status === 'pending'
      );

      if (isPending) {
        dispatch(setLatestJob({ email, job: newJob }));
        dispatch(addJob({ email, job: newJob })); // Add job immediately

        // Show toast notification
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
