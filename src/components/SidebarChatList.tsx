'use client';
import { chatHrefConstructor } from '@/lib/utils';
import { FC, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ExtendedMessage } from '@/lib/validations/message';
import axios from 'axios';
import Image from 'next/image';
import { MessageCircle, User, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobData } from './jobs/job';

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
    Record<string, { id: string; image?: string; name?: string }>
  >({});

  const [receiverIds, setReceiverIds] = useState<
    Record<string, { id: string; image?: string; name?: string }[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const fetchIds = async () => {
      const newReceiverIds: Record<
        string,
        { id: string; image?: string; name?: string }[]
      > = {};
      const newCreatorIds: Record<
        string,
        { id: string; image?: string; name?: string }
      > = {};

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
                    ? {
                        id: data.user._id,
                        image: data.user.image,
                        name: data.user.name,
                      }
                    : null;
                } catch {
                  return null;
                }
              })
            );

            newReceiverIds[job._id] = surgeonIds.filter(Boolean) as {
              id: string;
              image?: string;
              name?: string;
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
                  name: data.user.name,
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

  // Format date to show only month and day
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className='space-y-2 px-2'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-16 rounded-md bg-gray-100 animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-1'>
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

              const isActive = pathname?.includes(chatUrl);

              return (
                <Link
                  key={`${job._id}-${surgeonUserId.id}`}
                  href={chatUrl}
                  prefetch={false}
                  className={cn(
                    'block rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 p-2 border rounded-lg',
                      isActive ? 'border-blue-200' : 'border-gray-100'
                    )}
                  >
                    <div className='relative h-10 w-10 flex-shrink-0'>
                      <Image
                        src={surgeonUserId?.image || '/default.png'}
                        alt={surgeonUserId?.name || 'Surgeon'}
                        fill
                        sizes='(max-width: 768px) 100vw, 24px'
                        className='rounded-full object-cover border border-gray-200'
                      />
                      {unseenMessagesCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-blue-600 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white'>
                          {unseenMessagesCount}
                        </span>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-baseline'>
                        <h3
                          className={cn(
                            'text-sm font-medium truncate',
                            isActive ? 'text-blue-800' : 'text-gray-900'
                          )}
                        >
                          {surgeonUserId?.name || 'Surgeon'}
                        </h3>
                      </div>
                      {/*                       
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500 truncate">
                          {surgeon.email}
                        </p>
                      </div> */}

                      <div className='flex items-center gap-1 mt-1'>
                        <MessageCircle className='h-3 w-3 text-gray-400' />
                        <p className='text-xs truncate text-gray-600'>
                          {job.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
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

            const isActive = pathname?.includes(chatUrl);
            const creator = creatorIds[job._id];

            return (
              hasAcceptedSurgeon && (
                <Link
                  key={job._id}
                  href={chatUrl}
                  prefetch={false}
                  className={cn(
                    'block rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 p-2 border rounded-lg',
                      isActive ? 'border-blue-200' : 'border-gray-100'
                    )}
                  >
                    <div className='relative h-10 w-10 flex-shrink-0'>
                      <Image
                        src={creator?.image || '/default.png'}
                        alt={creator?.name || 'Patient'}
                        fill
                        sizes='(max-width: 768px) 100vw, 24px'
                        className='rounded-full object-cover border border-gray-200'
                      />
                      {unseenMessagesCount > 0 && (
                        <span className='absolute -top-1 -right-1 bg-blue-600 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white'>
                          {unseenMessagesCount}
                        </span>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-baseline'>
                        <h3
                          className={cn(
                            'text-sm font-medium truncate',
                            isActive ? 'text-blue-800' : 'text-gray-900'
                          )}
                        >
                          {creator?.name || 'Patient'}
                        </h3>
                      </div>

                      <div className='flex items-center gap-1'>
                        <MessageCircle className='h-3 w-3 text-gray-400' />
                        <p className='text-xs text-gray-500 truncate'>
                          {job.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            );
          }
        })
        .filter(Boolean)}

      {jobs.filter((job) =>
        job.surgeonEmails.some((surgeon) => surgeon.status === 'accepted')
      ).length === 0 && (
        <div className='text-center py-6 px-2'>
          <MessageCircle className='h-8 w-8 mx-auto text-gray-300' />
          <p className='mt-2 text-sm text-gray-500'>No active chats yet</p>
          <p className='text-xs text-gray-400'>
            Accepted requests will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default SidebarChatList;
