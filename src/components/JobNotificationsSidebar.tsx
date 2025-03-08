'use client';

import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  incrementUnseenJobCount,
  setUnseenJobCount,
} from '@/store/slices/jobSlice';
import { Briefcase } from 'lucide-react'; // Updated Icon
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface JobNotificationsSidebarProps {
  sessionEmail: string;
  initialUnseenJobCount: number;
}

const JobNotificationsSidebar: FC<JobNotificationsSidebarProps> = ({
  sessionEmail,
  initialUnseenJobCount,
}) => {
  const dispatch = useAppDispatch();
  const unseenJobCount = useAppSelector(
    (state) => state.jobs.unseenJobCounts[sessionEmail] || 0
  );
  console.log('unseenJobCount from the job notificaiotn', unseenJobCount);
  useEffect(() => {
    dispatch(
      setUnseenJobCount({
        email: sessionEmail,
        count: initialUnseenJobCount,
      })
    );
  }, [dispatch, sessionEmail, initialUnseenJobCount]);

  useEffect(() => {
    const jobKey = toPusherKey(`surgeon:${sessionEmail}:jobs`);
    pusherClient.subscribe(jobKey);

    console.log('jobKey pusehr', jobKey);
    const jobHandler = () => {
      dispatch(incrementUnseenJobCount({ email: sessionEmail }));
    };

    pusherClient.bind('new_job', jobHandler);

    return () => {
      pusherClient.unsubscribe(jobKey);
      pusherClient.unbind('new_job', jobHandler);
    };
  }, [sessionEmail, dispatch]);

  return (
    <Link
      href='/dashboard/requests'
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <Briefcase className='h-4 w-4' />
      </div>
      <p className='truncate'>Jobs</p>

      {unseenJobCount > 0 && (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
          {unseenJobCount}
        </div>
      )}
    </Link>
  );
};

export default JobNotificationsSidebar;
