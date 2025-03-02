'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [_, _1, jobId] = chatId.split('--');
  // console.log('jobid finding',data -1)
  // console.log('Subscribed to:', toPusherKey(`chat:${chatId}`));
  // console.log('chatPartner', chatPartner);
  console.log(
    'Subscribed to:',
    toPusherKey(`user:${`${chatPartner?._id}--${jobId}`}:chats`)
  );
  useEffect(() => {
    const userChatKey1 = toPusherKey(`user:${`${sessionId}--${jobId}`}:chats`);
    const userChatKey2 = toPusherKey(
      `user:${`${chatPartner?._id}--${jobId}`}:chats`
    );

    pusherClient.subscribe(userChatKey1);
    pusherClient.subscribe(userChatKey2);

    const messageHandler = (message: Message) => {
      console.log("ïncoming message", message);
      if( message.sender!==sessionId) return;
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind('incoming-message', messageHandler);
    pusherClient.bind('new_message', messageHandler);

    return () => {
      pusherClient.unsubscribe(userChatKey1);
      pusherClient.unsubscribe(userChatKey2);
      pusherClient.unbind('incoming-message', messageHandler);
      pusherClient.unbind('new_message', messageHandler);
    };
  }, [chatId]);

  const formatTimestamp = (timestamp: string | Date) => {
    return format(new Date(timestamp), 'HH:mm');
  };
  console.log('sessionImg', sessionId);
  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.sender === sessionId;
        // {console.log('message.sender',message.sender)}
        const hasNextMessageFromSameUser =
          messages[index - 1]?.sender === messages[index].sender;

        return (
          <div
            className='chat-message'
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.content}{' '}
                  <span className='ml-2 text-xs text-gray-400'>
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser
                      ? (sessionImg as string) || '/default.png'
                      : chatPartner.image || '/default.png'
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                  sizes='(max-width: 768px) 100vw, 24px'
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
