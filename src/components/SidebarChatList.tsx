'use client';

import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey, cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';
import Image from 'next/image';
import { ExtendedMessage } from '@/lib/validations/message';

interface SidebarChatListProps {
  friends: Friend[];
  sessionId: string;
}

export interface Friend {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Use ExtendedMessage for unseen messages
  const [unseenMessages, setUnseenMessages] = useState<ExtendedMessage[]>([]);
  const [activeChats, setActiveChats] = useState<Friend[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: Friend) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.sender)}`;

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
    pusherClient.bind('new_friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('new_friend', newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.sender));
      });
    }
  }, [pathname]);

  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {activeChats?.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (unseenMsg) => unseenMsg.sender === friend._id
        ).length;

        return (
          <li key={friend._id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend._id
              )}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              <Image
                src={friend.image || '/default.png'}
                alt={`${friend.name}'s profile`}
                className='rounded-full'
                width={24}
                height={24}
                sizes='(max-width: 768px) 100vw, 24px'
                onError={(e) => {
                  e.currentTarget.src = '/default-profile.png';
                }}
              />
              {friend.name}
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
  );
};

export default SidebarChatList;
