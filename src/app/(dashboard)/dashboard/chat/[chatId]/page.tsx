import Chat from '@/components/Chat';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Message from '@/app/models/Message';

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
    _id: msg._id.toString(),
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
  const [userId1, userId2] = chatId.split('--');
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

  const initialMessages = await getChatMessages(chatId);

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
