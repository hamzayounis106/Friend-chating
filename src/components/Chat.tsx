'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialMessages } from '@/store/slices/chatSlice';
import Image from 'next/image';
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';

interface ChatProps {
  chatId: string;
  chatPartner: {
    id: string;
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  sessionUser: {
    id: string;
    image: string;
  };
  initialMessages: any[];
}

const Chat = ({
  chatId,
  chatPartner,
  sessionUser,
  initialMessages,
}: ChatProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialMessages(initialMessages));
  }, [dispatch, initialMessages]);

  return (
    <div className='flex-1 flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
            <Image
              fill
              referrerPolicy='no-referrer'
              src={chatPartner.image || '/default.png'}
              alt={`${chatPartner.name} profile picture`}
              className='rounded-full'
              sizes='(max-width: 768px) 100vw, 24px'
            />
          </div>
          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
            </div>
            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={sessionUser.image}
        sessionId={sessionUser.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default Chat;
