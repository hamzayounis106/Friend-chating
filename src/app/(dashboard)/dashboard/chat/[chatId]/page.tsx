// src/app/(dashboard)/dashboard/chat/[chatId]/page.tsx
import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User from '@/app/models/User';
import Message from '@/app/models/Message';
import Image from 'next/image';
import Job from '@/app/models/Job';
import { JobData } from '../../requests/page';
import { pl } from 'date-fns/locale';

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
  const [userId1, userId2,jobId] = chatId.split('--');
  console.log('userId1, userId2,jobId',userId1, userId2,jobId)
  // Find messages where sender/receiver match the two users
  const messages = await Message.find({  
    $or: [
      { sender: userId1, receiver: userId2 , jobId: jobId},
      { sender: userId2, receiver: userId1 ,jobId: jobId},
      
    ],
  })
    .sort({ timestamp: -1 })
    .lean();
console.log('all find messages  messages',messages)
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
// console.log('plainMessages FROM DATA', plainMessages)

const page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { chatId } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2, jobId] = chatId.split('--');
  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;
  // Retrieve chat partner from MongoDB
  const chatPartnerDoc = await User.findById(chatPartnerId).lean();
  if (!chatPartnerDoc) notFound();
  
  const rawJob = await Job.findById(jobId.toString())
    .select('_id title type date description surgeonEmails videoURLs createdBy patientId')
    .lean();

  if (!rawJob) notFound();
  // Convert to plain object and transform fields
  const plainJob = JSON.parse(JSON.stringify(rawJob));
  // Convert Mongoose-specific types to primitives
  const relatedJob: JobData = {
    _id: plainJob._id.toString(),
    title: plainJob.title,
    type: plainJob.type,
    date: new Date(plainJob.date).toISOString(),
    description: plainJob.description,
    surgeonEmails: plainJob.surgeonEmails.map((se: any) => ({
      email: se.email,
      status: se.status
    })),
    videoURLs: plainJob.videoURLs,
    createdBy: plainJob.createdBy.toString(),
    patientId: plainJob.patientId.toString()
  };
  
// if(!relatedJob) notFound()
// console.log("relatedJob", relatedJob)
// console.log("user", user)
// console.log("chatPartnerDoc", chatPartnerDoc)
  // Fully serialize the chat partner document to remove non-plain values
  const plainChatPartner = JSON.parse(JSON.stringify(chatPartnerDoc));
  plainChatPartner._id = plainChatPartner._id.toString();

  const initialMessages = await getChatMessages(chatId); ///is main 3no id bhjni
  console.log('initail message to check pusher',initialMessages)

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
              <span className='text-gray-700 mr-3 font-semibold'>
                {relatedJob?.title as string} 
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
        // relatedJob={relatedJob}  kabhidsdsfsd 
        sessionImg={session.user.image}
        sessionId={session.user.id.toString()}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={plainChatPartner}  />
    </div>
  );
};

export default page;
