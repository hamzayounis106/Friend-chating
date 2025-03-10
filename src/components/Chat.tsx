'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialMessages } from '@/store/slices/chatSlice';
import Image from 'next/image';
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';
import { MessageCircle, Phone, Video } from 'lucide-react';

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
      {/* Chat Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm'>
        <div className='flex items-center space-x-3'>
          <div className='relative w-10 h-10'>
            <Image
              fill
              referrerPolicy='no-referrer'
              src={chatPartner.image || '/default.png'}
              alt={`${chatPartner.name} profile picture`}
              className='rounded-full object-cover'
              sizes='(max-width: 768px) 40px, 40px'
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-gray-800 font-medium leading-tight'>
              {chatPartner.name}
            </span>
            <span className='text-xs text-gray-500'>{chatPartner.email}</span>
          </div>
        </div>

        <div className='flex items-center space-x-2'></div>
      </div>

      {/* Message Thread Area */}
      <div className='flex-1 bg-gray-50 overflow-hidden'>
        <Messages
          chatId={chatId}
          chatPartner={chatPartner}
          sessionImg={sessionUser.image}
          sessionId={sessionUser.id}
        />
      </div>

      {/* Chat Input Area */}
      <div className='bg-white border-t border-gray-100'>
        <ChatInput chatId={chatId} chatPartner={chatPartner} />
      </div>
    </div>
  );
};

export default Chat;
