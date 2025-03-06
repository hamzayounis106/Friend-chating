import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import User, { LeanUser } from '@/app/models/User';
import Job from '@/app/models/Job';
import Offer, { LeanOffer } from '@/app/models/Offer';
import OfferForm from '@/components/offer/OfferForm';
import { ChatPartner } from '../page';
import OfferDetails from '@/components/offer/OfferDetails';
import OfferResponse from '@/components/offer/OfferResponse';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

// ✅ Define types
interface JobType {
  _id: string;
  title: string;
}

export interface OfferType {
  _id: string;
  cost: number;
  status: string;
  createdAt: string;
  createdBy: string;
  jobId: string;
  location: string;
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

  const chatPartner: ChatPartner = {
    id: chatPartnerDoc._id.toString(),
    _id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name) || 'Unknown',
    email: String(chatPartnerDoc.email) || 'No Email',
    image: String(chatPartnerDoc.image) || '/default.png',
  };

  let jobTitle: string | null = null;
  let offerSender: LeanUser | null = null;

  let offersDetails: OfferType[] = [];

  // ✅ Fetch multiple offers if the user is a patient
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
      }));

      offerSender = await User.findById(
        offersData[0].createdBy
      ).lean<LeanUser>();

      const jobData = await Job.findById(offersData[0].jobId)
        .select('title')
        .lean<JobType>();
      jobTitle = jobData ? jobData.title : null;
    }
  }

  // ✅ Fetch the surgeon's created offer
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
      }));
    }
  }

  return (
    <div className='p-4 space-y-6'>
      {userRole === 'surgeon' ? (
        <>
          <OfferForm chatPartner={chatPartner} jobId={jobId} userId={user.id} />
          {surgeonOffers?.length > 0 && (
            <OfferDetails
              offerDetails={surgeonOffers}
              offerSender={session.user}
            />
          )}
        </>
      ) : offersDetails.length > 0 ? (
        offersDetails.map((offer) => (
          <OfferResponse
            key={offer._id}
            offerDetails={{
              ...offer,
              createdAt: new Date(offer.createdAt),
            }}
          />
        ))
      ) : (
        <p>No offers available</p>
      )}
    </div>
  );
};

export default OfferPage;
