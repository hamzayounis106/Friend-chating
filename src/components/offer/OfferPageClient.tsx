'use client';

import { useAppSelector } from '@/store/hooks';
import OfferForm from '@/components/offer/OfferForm';
import OfferDetails from '@/components/offer/OfferDetails';
import OfferResponse from '@/components/offer/OfferResponse';
import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import { useEffect, useState } from 'react';
interface OfferPageClientProps {
  offersDetails: OfferType[];
  surgeonOffers: OfferType[];
  acceptedOffer: OfferType | null;
  isJobScheduled: boolean;
  userRole: string;
  chatPartner: any;
  jobId: string;
  userId: string;
  session: any;
  status: string;
  isAllowedToChat: boolean; // Add these
  doesPatientHaveCredits: boolean;
}

const OfferPageClient = ({
  offersDetails,
  surgeonOffers,
  acceptedOffer,
  isJobScheduled,
  userRole,
  chatPartner,
  jobId,
  userId,
  session,
  status,
  isAllowedToChat,
  doesPatientHaveCredits,
}: OfferPageClientProps) => {
  const { offers: reduxOffers } = useAppSelector((state) => state.offers);
  const filteredReduxOffers = reduxOffers.filter(
    (offer) => !offersDetails.some((dbOffer) => dbOffer._id === offer._id)
  );

  const [mergedOffers, setMergedOffers] = useState([
    ...offersDetails,
    ...filteredReduxOffers,
  ]);
  // rerender after accept or decline

  console.log('mergedOffers 🧰🧰🧰🧰', mergedOffers);
  useEffect(() => {
    console.log(
      'Offers updated: from the use effect 👤👤👤👤👤👤👤👤👤 ',
      reduxOffers
    );
    setMergedOffers([...offersDetails, ...filteredReduxOffers]);
  }, [reduxOffers, offersDetails]);

  return (
    <div className='p-4 space-y-6'>
      {isJobScheduled && userRole === 'surgeon' && (
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
              userId={userId}
              jobStatus={status}
            />
          )}

          {surgeonOffers?.length > 0 && (
            <OfferDetails
              offerDetails={surgeonOffers}
              offerSender={session.user}
            />
          )}
        </>
      ) : mergedOffers.length > 0 ? (
        mergedOffers
          .filter((offer) => offer.createdBy === chatPartner.id) // Filter offers where createdBy matches the second ID in params
          .map((offer) => (
            <OfferResponse
              key={offer._id}
              offerDetails={offer}
              isAllowedToChat={isAllowedToChat}
              doesPatientHaveCredits={doesPatientHaveCredits}
              chatPartner={chatPartner?.name}
              hasRecievedOffer={mergedOffers.length > 0}
            />
          ))
      ) : (
        <p className='text-center p-4 text-gray-600'>
          {isJobScheduled
            ? 'This job already has an accepted offer.'
            : 'No offers available yet.'}
        </p>
      )}
    </div>
  );
};

export default OfferPageClient;
