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

// Define types
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

  const chatPartner: ChatPartner = {
    id: chatPartnerDoc._id.toString(),
    _id: chatPartnerDoc._id.toString(),
    name: String(chatPartnerDoc.name) || 'Unknown',
    email: String(chatPartnerDoc.email) || 'No Email',
    image: String(chatPartnerDoc.image) || '/default.png',
  };

  // Fetch the job to check its status
  const jobData = await Job.findById(jobId).lean<JobType>();
  if (!jobData) notFound();

  const jobTitle = jobData.title;
  const jobStatus = jobData.status;
  const isJobScheduled = jobStatus === 'scheduled';

  let offerSender: LeanUser | null = null;
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
        expectedSurgeoryDate: offer.date.toString(),
      }));

      offerSender = await User.findById(
        offersData[0].createdBy
      ).lean<LeanUser>();
    }
    // console.log('offer Data from the notification', offersData);
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
        expectedSurgeoryDate: offer.date.toString(),
      }));
    }
    console.log('surgeon offer Data from the notification', offersData);
  }

  // Find the accepted offer if job is scheduled
  let acceptedOffer: OfferType | null = null;
  if (isJobScheduled) {
    const acceptedOfferData = await Offer.findOne({
      jobId: jobId,
      status: 'accepted',
    }).lean<LeanOffer>();

    if (acceptedOfferData) {
      const acceptedOfferSender = await User.findById(
        acceptedOfferData.createdBy
      ).lean<LeanUser>();

      acceptedOffer = {
        _id: acceptedOfferData._id.toString(),
        cost: acceptedOfferData.cost,
        status: acceptedOfferData.status,
        createdAt: acceptedOfferData.createdAt.toISOString(),
        createdBy: acceptedOfferData.createdBy.toString(),
        jobId: acceptedOfferData.jobId.toString(),
        location: acceptedOfferData.location,
        expectedSurgeoryDate: acceptedOfferData.date.toString(),
      };
    }
  }
  console.log('acceptedOffer', acceptedOffer);
  const isThisUserCreatedOffer = user.id === acceptedOffer?.createdBy;
  return (
    <div className='p-4 space-y-6'>
      {isJobScheduled && (
        <div className='rounded-md bg-green-50 p-4 mb-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-green-400'
                viewBox='0 0 20 20'
                fill='currentColor'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-green-800'>
                Offer Accepted
              </h3>
              <div className='mt-2 text-sm text-green-700'>
                <p>
                  An offer for this job has been accepted and a surgery has been
                  scheduled.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {userRole === 'surgeon' ? (
        <>
          {!isJobScheduled && (
            <OfferForm
              chatPartner={chatPartner}
              jobId={jobId}
              userId={user.id}
            />
          )}

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
        <p className='text-center p-4 text-gray-600'>
          {isJobScheduled
            ? 'This job already has an accepted offer.'
            : 'No offers available yet.'}
        </p>
      )}
      {/* 
      {isJobScheduled && acceptedOffer && isThisUserCreatedOffer && (
        <div className="mt-8 p-4 border border-green-200 rounded-lg bg-green-50">
          <h2 className="text-lg font-medium text-green-800 mb-4">Accepted Offer Details</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Cost</dt>
              <dd className="mt-1 text-sm text-gray-900">${acceptedOffer.cost.toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{acceptedOffer.location}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Surgery Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(acceptedOffer.expectedSurgeoryDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(acceptedOffer.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      )} */}
    </div>
  );
};

export default OfferPage;
