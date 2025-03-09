'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { addMessage } from '@/store/slices/chatSlice';
import { RootState } from '@/store/store';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [_, userId2, jobId] = chatId.split('--');
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);

  useEffect(() => {
    const userChatKey = toPusherKey(`user:${sessionId}--${jobId}:chats`);
    pusherClient.subscribe(userChatKey);

    const messageHandler = (message: Message) => {
      if (message.sender !== userId2) return;
      const formattedMessage = {
        ...message,
        timestamp: new Date(message.timestamp).toISOString(),
      };
      dispatch(addMessage(formattedMessage)); // Use context to update state
    };
    pusherClient.bind('new_message', messageHandler);

    return () => {
      pusherClient.unsubscribe(userChatKey);
      pusherClient.unbind('new_message', messageHandler);
    };
  }, [chatId, sessionId, jobId, dispatch, userId2]);

  const formatTimestamp = (timestamp: string | Date) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <div key={chatId}
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-gray-50'
    >
      <div ref={scrollDownRef} />
      
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 rounded-lg bg-white border border-gray-200 shadow-sm max-w-sm">
            <div className="bg-blue-50 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-500 text-sm">
              Start the conversation with {chatPartner.name}
            </p>
          </div>
        </div>
      )}
      
      {messages.map((message, index) => {
        const isCurrentUser = message.sender === sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.sender === messages[index].sender;

        // Check if this is the first message of the day
        const isFirstMessageOfDay = index === messages.length - 1 || 
          new Date(message.timestamp).toDateString() !== 
          new Date(messages[index + 1].timestamp).toDateString();

        // Render date separator for first message of the day
        const dateHeader = isFirstMessageOfDay && (
          <div className="flex justify-center my-4">
            <div className="bg-gray-200 px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-gray-700">
                {format(new Date(message.timestamp), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        );

        return (
          <>
            {dateHeader}
            <div
              className={cn('chat-message mb-2')}
              key={`${message.id}-${message.timestamp}`}
            >
              <div
                className={cn('flex items-end', {
                  'justify-end': isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    'flex flex-col space-y-1 text-base max-w-xs mx-2',
                    {
                      'order-1 items-end': isCurrentUser,
                      'order-2 items-start': !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn('px-4 py-2 rounded-lg inline-block shadow-sm', {
                      'bg-blue-600 text-white': isCurrentUser,
                      'bg-white border border-gray-200 text-gray-800': !isCurrentUser,
                      'rounded-br-none':
                        !hasNextMessageFromSameUser && isCurrentUser,
                      'rounded-bl-none':
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.content}
                  </span>
                  <span className={cn('text-xs text-gray-500 px-1', {
                    'text-right': isCurrentUser,
                    'text-left': !isCurrentUser
                  })}>
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>

                <div
                  className={cn('relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white', {
                    'order-2': isCurrentUser,
                    'order-1': !isCurrentUser,
                    'invisible': hasNextMessageFromSameUser,
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
                    className='object-cover'
                    sizes='32px'
                  />
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Messages;