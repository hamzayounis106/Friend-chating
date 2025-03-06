import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Job from '@/app/models/Job';
import OfferForm from '@/components/OfferForm';
import { ChatPartner } from '../page';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

// ✅ Define a type for Job
interface JobType {
  _id: string;
  title: string;
  date: Date;
}

const OfferPage = async ({ params }: PageProps) => {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // Extract user IDs and job ID from chatId
  const [userId1, userId2, jobId] = chatId.split('--');
  if (!userId1 || !userId2 || !jobId) return notFound();

  // Validate user access
  const { user } = session;
  if (user.id !== userId1 && user.id !== userId2) notFound();

  // Get chat partner details
  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;
  const chatPartnerDoc = await User.findById(chatPartnerId).lean<LeanUser>();
  if (!chatPartnerDoc) notFound();

  // Get job details
  const job = await Job.findById(jobId).lean<JobType>();
  if (!job) notFound();

  // Prepare data for client components
  const chatPartner: ChatPartner = {
    id: chatPartnerDoc._id.toString(),
    _id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name) || 'Unknown',
    email: String(chatPartnerDoc.email) || 'No Email',
    image: String(chatPartnerDoc.image) || '/default.png',
  };

  const jobDetails: JobType = {
    _id: job._id.toString(),
    title: job.title,
    date: new Date(job.date), // Ensure it's a Date object
  };

  return (
    <div className='p-4 space-y-6'>
      <div className='border-b pb-4'>
        <h2 className='text-2xl font-semibold'>Offer for {jobDetails.title}</h2>
        <p className='text-gray-600'>
          Job Date: {jobDetails.date.toLocaleDateString()}
        </p>
      </div>

      <OfferForm
        chatPartner={chatPartner}
        jobId={jobDetails._id}
        userId={user.id}
      />
    </div>
  );
};

export default OfferPage;
