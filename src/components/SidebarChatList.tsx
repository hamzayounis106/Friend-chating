'use client';

import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey, cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';
import Image from 'next/image';
import { ExtendedMessage } from '@/lib/validations/message';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';

interface SidebarChatListProps {
  jobs: JobData[];
  sessionId: string;
}

export interface Friend {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ jobs, sessionId }) => {
  // console.log('jobs SCL', jobs);
  //  console.log('sessionId SCL', sessionId);
  const router = useRouter();
  const pathname = usePathname();
  // Use ExtendedMessage for unseen messages
  const [unseenMessages, setUnseenMessages] = useState<ExtendedMessage[]>([]);
  const [activeChats, setActiveChats] = useState<JobData[]>(jobs);
const [seletedJobId, setSelectedJobId] = useState<string>("");
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:jobs`));

    const newJobHandler = (newJob: JobData) => {
      setActiveChats((prev) => [...prev, newJob]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.sender, seletedJobId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.sender}
          senderImg={message.senderImg}
          senderMessage={message.content}
          senderName={message.senderName}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind('new_message', chatHandler);
    pusherClient.bind('job_accepted', newJobHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:jobs`));

      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('job_accepted', newJobHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.sender));
      });
    }
  }, [pathname]);
  // console.log('activeChats SCL', activeChats);
  return (
  <>
   {/* <h2>Chats</h2> */}
  
   <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
   {jobs
    ?.filter((job) => job.surgeonEmails.some((surgeon) => surgeon.status === 'accepted'))
    .sort() // Sorting can be customized if needed
    .map((job) => {
      const unseenMessagesCount = unseenMessages.filter(
        (unseenMsg) => unseenMsg.sender === job._id
      ).length;
        return (
          <li key={job._id}>
            <a onClick={() => setSelectedJobId(job._id)}
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                job.createdBy,
                job._id
              )}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              {/* <Image
                src={job.image || '/default.png'}
                alt={`${job.name}'s profile`}
                className='rounded-full'
                width={24}
                height={24}
                sizes='(max-width: 768px) 100vw, 24px'
                onError={(e) => {
                  e.currentTarget.src = '/default-profile.png';
                }}
              /> */}
              {job.title}
              {job.type}
                
              {unseenMessagesCount > 0 && (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMessagesCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  </>
  );
};

export default SidebarChatList;
