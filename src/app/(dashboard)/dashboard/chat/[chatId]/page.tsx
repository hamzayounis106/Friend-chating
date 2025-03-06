// src/app/(dashboard)/dashboard/chat/[chatId]/page.tsx
import Chat from '@/components/Chat';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Message from '@/app/models/Message';
import Job, { LeanJob } from '@/app/models/Job';
import { JobData } from '../../requests/page';
import { SurgeonEmail } from '@/types/surgeon';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const [userId1, userId2] = chatId.split('--');
  const { user } = session;
  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;

  const chatPartnerDoc = await User.findById(chatPartnerId).lean();
  if (!chatPartnerDoc) notFound();

  const plainChatPartner = JSON.parse(JSON.stringify(chatPartnerDoc));
  plainChatPartner._id = plainChatPartner._id.toString();

  return { title: `Secure Cosmetics | ${plainChatPartner.name} chat` };
}

async function getChatMessages(chatId: string) {
  const [userId1, userId2, jobId] = chatId.split('--');
  if (!userId1 || !userId2 || !jobId) {
    throw new Error('Invalid chatId');
  }

  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2, jobId: jobId },
      { sender: userId2, receiver: userId1, jobId: jobId },
    ],
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
  const [userId1, userId2, jobId] = chatId.split('--');
  if (!userId1 || !userId2 || !jobId) return notFound();

  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;
  const chatPartnerDoc = await User.findById(chatPartnerId).lean<LeanUser>(); // ✅ Fix TypeScript error
  if (!chatPartnerDoc) notFound();

  const rawJob = await Job.findById(jobId)
    .select(
      '_id title type date description surgeonEmails AttachmentUrls createdBy patientId'
    )
    .populate('patientId') // ✅ Populate the patientId field
    .lean<LeanJob>(); // ✅ Properly typing lean() output
  if (!rawJob) notFound();

  const relatedJob: JobData = {
    _id: rawJob._id?.toString(),
    title: rawJob.title,
    type: rawJob.type,
    date: new Date(rawJob.date).toISOString(),
    description: rawJob.description ?? '', // Ensure a default value
    surgeonEmails: rawJob.surgeonEmails.map((se: SurgeonEmail) => ({
      email: se.email,
      status: se.status,
    })),
    createdBy: rawJob.createdBy.toString(),
    patientId: {
      _id: rawJob.patientId._id.toString(),
      name: rawJob.patientId.name,
      email: rawJob.patientId.email,
      image: rawJob.patientId.image,
    },
    AttachmentUrls: rawJob.AttachmentUrls ?? [], // Ensure a default value
  };

  const chatPartner = {
    id: chatPartnerDoc._id.toString(), // ✅ Add 'id' property
    _id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name ?? 'Unknown'),
    email: String(chatPartnerDoc.email ?? 'No Email'),
    image: String(chatPartnerDoc.image ?? '/default.png'),
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
      relatedJob={relatedJob}
      initialMessages={initialMessages}
    />
  );
};

export default Page;
