'use client';

import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey, cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';
import { ExtendedMessage } from '@/lib/validations/message';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import axios from 'axios';

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
  const router = useRouter();
  const pathname = usePathname();

  const [unseenMessages, setUnseenMessages] = useState<ExtendedMessage[]>([]);
  const [activeChats, setActiveChats] = useState<JobData[]>(jobs);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [receiverIds, setReceiverIds] = useState<Record<string, string[]>>({});

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:jobs`));

    const newJobHandler = (newJob: JobData) => {
      setActiveChats((prev) => [...prev, newJob]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const isCurrentChatOpen =
        pathname ===
        `/dashboard/chat/${chatHrefConstructor(
          sessionId,
          message.sender,
          selectedJobId
        )}`;

      if (isCurrentChatOpen || message.receiver !== sessionId) return;

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
  }, [pathname, sessionId, router, selectedJobId]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSurgeonIds = async () => {
      const newReceiverIds: Record<string, string[]> = {};

      // Only needed for jobs where the logged-in user is the patient.
      await Promise.all(
        jobs.map(async (job) => {
          if (job.createdBy === sessionId) {
            // Get all accepted surgeons for this job.
            const acceptedSurgeons = job.surgeonEmails.filter(
              (s) => s.status === 'accepted'
            );
            // For each accepted surgeon, fetch the user ID from the API.
            const surgeonIds = await Promise.all(
              acceptedSurgeons.map(async (surgeon) => {
                if (surgeon.email) {
                  try {
                    const { data } = await axios.post('/api/user-by-email', {
                      email: surgeon.email,
                    });
                    if (data?.userId) {
                      return data.userId;
                    } else {
                      console.error(
                        `Failed to fetch user for email: ${surgeon.email}`,
                        data
                      );
                      return null;
                    }
                  } catch (error) {
                    console.error('Error fetching user ID:', error);
                    return null;
                  }
                }
                return null;
              })
            );
            // Filter out null values.
            newReceiverIds[job._id] = surgeonIds.filter(
              (id): id is string => id !== null
            );
          }
        })
      );

      console.log('Final Receiver IDs:', newReceiverIds);
      setReceiverIds(newReceiverIds);
      setIsLoading(false);
    };

    fetchSurgeonIds();
  }, [jobs, sessionId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {jobs
        ?.filter((job) => {
          const hasAcceptedSurgeon = job.surgeonEmails.some(
            (surgeon) => surgeon.status === 'accepted'
          );
          if (!hasAcceptedSurgeon) {
            console.error(`No accepted surgeon for job: ${job._id}`);
            return false;
          }
          return true;
        })
        .flatMap((job) => {
          // For patient view: create one list item per accepted surgeon.
          if (job.createdBy === sessionId) {
            const acceptedSurgeons = job.surgeonEmails.filter(
              (s) => s.status === 'accepted'
            );
            const surgeonIds = receiverIds[job._id] || [];
            return acceptedSurgeons.map((surgeon, idx) => {
              const surgeonUserId = surgeonIds[idx];
              if (!surgeonUserId) {
                console.error(
                  `Receiver ID is undefined for job: ${job._id} at index ${idx}`
                );
                return null;
              }
              // You can calculate unseenMessagesCount per surgeon if needed.
              const unseenMessagesCount = unseenMessages.filter(
                (msg) => msg.sender === job._id
              ).length;

              return (
                <li key={`${job._id}-${surgeonUserId}`}>
                  <a
                    onClick={() => setSelectedJobId(job._id)}
                    href={`/dashboard/chat/${chatHrefConstructor(
                      sessionId,
                      surgeonUserId,
                      job._id
                    )}`}
                    className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                  >
                    {job.title} ({job.type}) - {surgeon.email}
                    {unseenMessagesCount > 0 && (
                      <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                        {unseenMessagesCount}
                      </div>
                    )}
                  </a>
                </li>
              );
            });
          } else {
            // For surgeon view: chat partner is the patient.
            const unseenMessagesCount = unseenMessages.filter(
              (msg) => msg.sender === job._id
            ).length;
            const receiverId = job.createdBy; // Patient's ID.
            return (
              <li key={job._id}>
                <a
                  onClick={() => setSelectedJobId(job._id)}
                  href={`/dashboard/chat/${chatHrefConstructor(
                    sessionId,
                    receiverId,
                    job._id
                  )}`}
                  className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                >
                  {job.title} ({job.type})
                  {unseenMessagesCount > 0 && (
                    <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                      {unseenMessagesCount}
                    </div>
                  )}
                </a>
              </li>
            );
          }
        })
        .filter(Boolean)}
    </ul>
  );
};

export default SidebarChatList;
