'use client';
import { chatHrefConstructor } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ExtendedMessage } from '@/lib/validations/message';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import axios from 'axios';
import Image from 'next/image';

interface SidebarChatListProps {
  jobs: JobData[];
  sessionId: string;
  sessionEmail: string;
  session: any;
}

const SidebarChatList: FC<SidebarChatListProps> = ({
  jobs,
  sessionId,
  sessionEmail,
  session,
}) => {
  const [unseenMessages, setUnseenMessages] = useState<ExtendedMessage[]>([]);
  const [creatorIds, setCreatorIds] = useState<
    Record<string, { id: string; image?: string }>
  >({});

  const [receiverIds, setReceiverIds] = useState<
    Record<string, { id: string; image?: string }[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const fetchIds = async () => {
      const newReceiverIds: Record<string, { id: string; image?: string }[]> =
        {};
      const newCreatorIds: Record<string, { id: string; image?: string }> = {};

      await Promise.all(
        jobs.map(async (job) => {
          // Patient's perspective (created jobs)
          if (job.createdBy === sessionId) {
            const acceptedSurgeons = job.surgeonEmails.filter(
              (s) => s.status === 'accepted'
            );

            // Fetch surgeon details
            const surgeonIds = await Promise.all(
              acceptedSurgeons.map(async (surgeon) => {
                if (!surgeon.email) return null;
                try {
                  const { data } = await axios.post('/api/user-by-email', {
                    email: surgeon.email,
                  });
                  return data?.user
                    ? { id: data.user._id, image: data.user.image }
                    : null;
                } catch {
                  return null;
                }
              })
            );

            newReceiverIds[job._id] = surgeonIds.filter(Boolean) as {
              id: string;
              image?: string;
            }[];

            // Surgeon's perspective (accepted jobs)
          } else {
            const isAccepted = job.surgeonEmails.some(
              (s) => s.email === sessionEmail && s.status === 'accepted'
            );

            if (isAccepted) {
              try {
                const { data } = await axios.post('/api/user-by-id', {
                  id: job.createdBy,
                });
                newCreatorIds[job._id] = {
                  id: data.user._id,
                  image: data.user.image,
                };
              } catch (error) {
                console.error('Error fetching patient data:', error);
              }
            }
          }
        })
      );

      setReceiverIds(newReceiverIds);
      setCreatorIds(newCreatorIds);
      setIsLoading(false);
    };

    fetchIds();
  }, [jobs, sessionId, sessionEmail]);
  // console.log('Jobs😋😋😋😋😋😋😋😋😋😋😋', jobs);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {jobs
        .filter((job) =>
          job.surgeonEmails.some((surgeon) => surgeon.status === 'accepted')
        )
        .flatMap((job) => {
          if (job.createdBy === sessionId) {
            const acceptedSurgeons = job.surgeonEmails.filter(
              (s) => s.status === 'accepted'
            );
            const surgeonIds = receiverIds[job._id] || [];
            return acceptedSurgeons.map((surgeon, idx) => {
              const surgeonUserId = surgeonIds[idx];
              // console.log('surgeonUserId', surgeonUserId);
              if (!surgeonUserId) return null;
              const unseenMessagesCount = unseenMessages.filter(
                (msg) => msg.sender === job._id
              ).length;

              // Construct chat URL
              const chatUrl = `/dashboard/chat/${chatHrefConstructor(
                sessionId,
                surgeonUserId.id,
                job._id,
                session
              )}`;
              return (
                <li key={`${job._id}-${surgeonUserId.id}`}>
                  <Link
                    href={chatUrl}
                    prefetch={false}
                    className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold 
                      ${
                        pathname?.includes(chatUrl)
                          ? 'bg-indigo-100 text-indigo-700' // Active job highlight
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                  >
                    <Image
                      src={surgeonUserId?.image || '/default.png'}
                      alt='Surgeon'
                      width={70}
                      height={70}
                      className='rounded-full object-cover'
                    />
                    {job.title} - {surgeon.email}
                    {unseenMessagesCount > 0 && (
                      <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                        {unseenMessagesCount}
                      </div>
                    )}
                  </Link>
                </li>
              );
            });
          } else {
            const unseenMessagesCount = unseenMessages.filter(
              (msg) => msg.sender === job._id
            ).length;
            const receiverId = job.createdBy;
            const hasAcceptedSurgeon = job.surgeonEmails.some(
              (surgeon) =>
                surgeon.status === 'accepted' &&
                surgeon.email.toLowerCase().trim() === sessionEmail
            );

            // Construct chat URL
            const chatUrl = `/dashboard/chat/${chatHrefConstructor(
              receiverId,
              sessionId,
              job._id,
              session
            )}`;

            return (
              hasAcceptedSurgeon && (
                <li key={job._id}>
                  <Link
                    href={chatUrl}
                    prefetch={false} // Prevents unnecessary prefetching
                    className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold 
                      ${
                        pathname?.includes(chatUrl)
                          ? 'bg-indigo-100 text-indigo-700' // Active job highlight
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                  >
                    <Image
                      src={creatorIds[job._id]?.image || '/default.png'}
                      alt='Patient'
                      width={70}
                      height={70}
                      className='rounded-full object-cover'
                    />
                    {job.title} ({job.type})
                    {unseenMessagesCount > 0 && (
                      <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                        {unseenMessagesCount}
                      </div>
                    )}
                  </Link>
                </li>
              )
            );
          }
        })
        .filter(Boolean)}
    </ul>
  );
};

export default SidebarChatList;
