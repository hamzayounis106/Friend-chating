import Chat from '@/components/Chat';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Message from '@/app/models/Message';
import { verifyIsCreditUsed } from '@/helpers/verify-is-credit-used';
import { checkIfHaveCredits } from '@/helpers/check-if-have-credits';
import { AlertCircle, CreditCard, MessageCircle } from 'lucide-react';
// import { useCreditToStartChat } from "@/helpers/use-credit-to-start-chat";
import CreditUseButton from '@/components/CreditUseButton';

interface PageProps {
  params: Promise<{ chatId: string }>;
}
export interface ChatPartner {
  id: string;
  _id: string;
  name: string;
  email: string;
  image: string;
}

async function getChatMessages(chatId: string) {
  const [userId1, userId2, jobId3] = chatId.split('--');
  if (!userId1 || !userId2) throw new Error('Invalid chatId');

  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
    jobId: jobId3,
  })
    .sort({ timestamp: -1 })
    .lean();

  return messages.map((msg: any) => ({
    id: msg._id.toString(),
    sender: msg.sender.toString(),
    receiver: msg.receiver.toString(),
    timestamp: new Date(msg.timestamp).toISOString(),
    content: msg.content,
  }));
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2, jobId3] = chatId.split('--');
  if (!userId1 || !userId2 || (user.id !== userId1 && user.id !== userId2))
    notFound();

  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;
  const chatPartnerDoc = await User.findById(chatPartnerId).lean<LeanUser>();
  if (!chatPartnerDoc) notFound();

  const chatPartner: ChatPartner = {
    id: chatPartnerDoc._id.toString(),
    _id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name) || 'Unknown',
    email: String(chatPartnerDoc.email) || 'No Email',
    image: String(chatPartnerDoc.image) || '/default.png',
  };
  const userRole = user.role;
  const initialMessages = await getChatMessages(chatId);
  const isAlloweToChat = await verifyIsCreditUsed(jobId3, userId2);
  const doesPatientHaveCredits = await checkIfHaveCredits();
  console.log('doesPatientHaveCredits', doesPatientHaveCredits);
  console.log('isAlloweToChat', isAlloweToChat);
  console.log('userRole', userRole);
  // const handleUseCredit = async () => {
  //   const res = useCreditToStartChat(jobId3)
  //   console.log("res from use credit", res);
  // }
  if (
    !isAlloweToChat &&
    !doesPatientHaveCredits.success &&
    userRole === 'patient'
  ) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] bg-white rounded-lg shadow-sm p-8 mx-auto max-w-2xl'>
        <div className='text-orange-600 mb-6'>
          <AlertCircle size={48} className='mx-auto' />
        </div>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
          Credits Required
        </h2>
        <p className='text-gray-600 mb-6 text-center max-w-md'>
          You need to purchase credits to start a chat with this surgeon.
          Credits allow you to connect with specialists for consultations.
        </p>
        <a
          href='/dashboard/credits'
          className='flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
        >
          <CreditCard className='mr-2 h-5 w-5' />
          Purchase Credits
        </a>
      </div>
    );
  }
  if (
    !isAlloweToChat &&
    userRole === 'patient' &&
    doesPatientHaveCredits.success
  ) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] bg-white rounded-lg shadow-sm p-8 mx-auto max-w-2xl'>
        <div className='text-blue-600 mb-6'>
          <MessageCircle size={48} className='mx-auto' />
        </div>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
          Start Your Consultation
        </h2>
        <p className='text-gray-600 mb-6 text-center max-w-md'>
          You have credits available! Use one credit to start chatting with{' '}
          {chatPartner.name}.
        </p>

        <CreditUseButton
          jobId={jobId3}
          surgeonId={userId2}
          chatPartnerName={chatPartner.name}
        />
      </div>
    );
  }

  return (
    <Chat
      chatId={chatId}
      chatPartner={chatPartner}
      sessionUser={{
        id: session.user.id,
        image: session.user.image ?? '/default.png',
      }}
      initialMessages={initialMessages}
    />
  );
};

export default Page;
