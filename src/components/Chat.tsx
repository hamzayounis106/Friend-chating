'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInitialMessages } from '@/store/slices/chatSlice';
import Image from 'next/image';
import Messages from '@/components/Messages';
import ChatInput from '@/components/ChatInput';
import SendOfferModal from '@/components/SendOfferModal'; // Assuming you have a SendOfferModal component
import JobDetailsOnChat from './JobDetailsOnChat';
import { useSession } from 'next-auth/react';

interface ChatProps {
  chatId: string;
  chatPartner: {
    id: string; // ✅ Added id
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  sessionUser: {
    id: string;
    image: string;
  };
  relatedJob: {
    title: string;
    type: string;
    date: string;
    description: string;
    patientId: {
      name: string;
      email: string;
      image: string;
    };
    createdBy: string;
    AttachmentUrls: string[];
    surgeonEmails: { email: string }[];
  };
  initialMessages: any[];
}

const Chat = ({
  chatId,
  chatPartner,
  sessionUser,
  relatedJob,
  initialMessages,
}: ChatProps) => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('chat');
  const [isModalOpen, setIsModalOpen] = useState(false);
const session = useSession();
  const userRole = session?.data?.user?.role;
  console.log("Related Job", relatedJob);
  useEffect(() => {
    dispatch(setInitialMessages(initialMessages));
  }, [dispatch, initialMessages]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex-1 flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
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
          </div>
          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.name}
              </span>
              <span className='text-gray-700 mr-3 font-semibold'>
                {relatedJob.title}
              </span>
            </div>
            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
        <div className='flex space-x-4'>
          <button
            className={`px-4 py-2 rounded ${activeSection === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleSectionChange('chat')}
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 rounded ${activeSection === 'jobDetails' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleSectionChange('jobDetails')}
          >
            Job Details
          </button>
          {userRole === 'surgeon' && (
            <button
            className='px-4 py-2 bg-green-500 text-white rounded'
            onClick={handleModalOpen}
            >
            Send Offer
          </button>
          )}
        </div>
      </div>

      {activeSection === 'chat' && (
        <>
          <Messages
            chatId={chatId}
            chatPartner={chatPartner}
            sessionImg={sessionUser.image}
            sessionId={sessionUser.id}
            initialMessages={initialMessages}
          />
          <ChatInput chatId={chatId} chatPartner={chatPartner} />
        </>
      )}

      {activeSection === 'jobDetails' && (
        <JobDetailsOnChat job={relatedJob} userRole={userRole} />
      )}

      {isModalOpen && (
        <SendOfferModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          chatPartner={chatPartner}
        />
      )}
    </div>
  );
};

export default Chat;