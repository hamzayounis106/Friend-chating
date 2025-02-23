// src/app/(dashboard)/dashboard/chat/[chatId]/page.tsx
import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

// Generate metadata (adjusted to await params)
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const [userId1, userId2] = resolvedParams.chatId.split('--');
  const { user } = session;
  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;

  // Retrieve chat partner from MongoDB
  const chatPartnerDoc = await User.findById(chatPartnerId).lean();
  if (!chatPartnerDoc) notFound();

  // Fully serialize to remove non-plain values (like buffers)
  const plainChatPartner = JSON.parse(JSON.stringify(chatPartnerDoc));
  // Optionally, ensure _id is a string (it should be now)
  plainChatPartner._id = plainChatPartner._id.toString();

  return { title: `FriendZone | ${plainChatPartner.name} chat` };
}

// Helper function to load chat messages from MongoDB
async function getChatMessages(chatId: string) {
  const [userId1, userId2] = chatId.split('--');
  // Find messages where sender/receiver match the two users
  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  })
    .sort({ timestamp: -1 })
    .lean();

  // Fully serialize each message to remove non-plain values
  const plainMessages = JSON.parse(JSON.stringify(messages)).map((msg: any) => {
    msg._id = msg._id.toString();
    msg.sender = msg.sender.toString();
    msg.receiver = msg.receiver.toString();
    msg.timestamp = new Date(msg.timestamp).toISOString();
    return msg;
  });

  return plainMessages;
}

const page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { chatId } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split('--');
  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;
  // Retrieve chat partner from MongoDB
  const chatPartnerDoc = await User.findById(chatPartnerId).lean();
  if (!chatPartnerDoc) notFound();

  // Fully serialize the chat partner document to remove non-plain values
  const plainChatPartner = JSON.parse(JSON.stringify(chatPartnerDoc));
  plainChatPartner._id = plainChatPartner._id.toString();

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={plainChatPartner.image || '/default.png'}
                alt={`${plainChatPartner.name} profile picture`}
                className='rounded-full'
                sizes='(max-width: 768px) 100vw, 24px'
              />
            </div>
          </div>
          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {plainChatPartner?.name}
              </span>
            </div>
            <span className='text-sm text-gray-600'>
              {plainChatPartner.email}
            </span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={plainChatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id.toString()}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={plainChatPartner} />
    </div>
  );
};

export default page;
