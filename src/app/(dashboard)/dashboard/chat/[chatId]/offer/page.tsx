import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Job from '@/app/models/Job';
import Offer, { LeanOffer } from '@/app/models/Offer';
import OfferPageClient from '@/components/offer/OfferPageClient';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

interface JobType {
  _id: string;
  title: string;
  status: string;
}

export interface OfferType {
  _id: string;
  cost: number;
  status: string;
  createdAt: string;
  createdBy: string;
  jobId: string;
  location: string;
  description: string;
  expectedSurgeoryDate: string;
}

const OfferPage = async ({ params }: PageProps) => {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const [userId1, userId2, jobId] = chatId.split('--');
  if (!userId1 || !userId2 || !jobId) return notFound();

  const { user } = session;
  if (user.id !== userId1 && user.id !== userId2) notFound();

  const userRole = session?.user?.role;
  const chatPartnerId = user.id.toString() === userId1 ? userId2 : userId1;

  const chatPartnerDoc = await User.findById(chatPartnerId).lean<LeanUser>();
  if (!chatPartnerDoc) notFound();

  const chatPartner = {
    id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name) || 'Unknown',
    email: String(chatPartnerDoc.email) || 'No Email',
    image: String(chatPartnerDoc.image) || '/default.png',
  };

  // Fetch the job to check its status
  const jobData = await Job.findById(jobId).lean<JobType>();
  if (!jobData) notFound();

  const jobStatus = jobData.status;
  const isJobScheduled = jobStatus === 'scheduled';

  let offersDetails: OfferType[] = [];

  // Fetch multiple offers if the user is a patient
  if (userRole === 'patient') {
    const offersData: LeanOffer[] = await Offer.find({
      jobId: jobId,
      createdBy: chatPartnerId,
    }).lean<LeanOffer[]>();

    if (offersData?.length > 0) {
      offersDetails = offersData?.map((offer) => ({
        _id: offer._id.toString(),
        cost: offer.cost,
        status: offer.status,
        createdAt: offer.createdAt.toISOString(),
        createdBy: offer.createdBy.toString(),
        jobId: offer.jobId.toString(),
        location: offer.location,
        description: offer.description ?? 'No description provided',
        expectedSurgeoryDate: offer.date.toString(),
      }));
    }
  }

  // Fetch the surgeon's created offer
  let surgeonOffers: OfferType[] = [];
  if (userRole === 'surgeon') {
    const offersData = await Offer.find({
      jobId: jobId,
      createdBy: user.id,
    }).lean<LeanOffer[]>();

    if (offersData.length > 0) {
      surgeonOffers = offersData.map((offer) => ({
        _id: offer._id.toString(),
        cost: offer.cost,
        status: offer.status,
        createdAt: offer.createdAt.toISOString(),
        createdBy: offer.createdBy.toString(),
        jobId: offer.jobId.toString(),
        location: offer.location,
        description: offer.description ?? 'No description provided',
        expectedSurgeoryDate: offer.date.toString(),
      }));
    }
  }

  // Find the accepted offer if job is scheduled
  let acceptedOffer: OfferType | null = null;
  if (isJobScheduled) {
    const acceptedOfferData = await Offer.findOne({
      jobId: jobId,
      status: 'accepted',
    }).lean<LeanOffer>();

    if (acceptedOfferData) {
      acceptedOffer = {
        _id: acceptedOfferData._id.toString(),
        cost: acceptedOfferData.cost,
        status: acceptedOfferData.status,
        createdAt: acceptedOfferData.createdAt.toISOString(),
        createdBy: acceptedOfferData.createdBy.toString(),
        jobId: acceptedOfferData.jobId.toString(),
        location: acceptedOfferData.location,
        description: acceptedOfferData.description ?? 'No description provided',
        expectedSurgeoryDate: acceptedOfferData.date.toString(),
      };
    }
  }

  return (
    <OfferPageClient
      offersDetails={offersDetails}
      surgeonOffers={surgeonOffers}
      acceptedOffer={acceptedOffer}
      isJobScheduled={isJobScheduled}
      userRole={userRole as string}
      chatPartner={chatPartner}
      jobId={jobId}
      userId={user.id}
      session={session}
    />
  );
};

export default OfferPage;
