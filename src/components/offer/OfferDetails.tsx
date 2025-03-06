import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import { Session } from 'next-auth';

const OfferDetails = ({
  offerDetails,
  offerSender,
}: {
  offerDetails: OfferType[]; // ✅ Changed to an array to handle multiple offers
  offerSender: Session['user'] | null;
}) => {
  return (
    <div className='bg-gray-100 p-4 rounded-md'>
      <h3 className='text-lg font-semibold'>Offer Details</h3>
      {offerDetails.length > 0 ? (
        offerDetails.map((offer) => (
          <div
            key={offer._id}
            className='mt-2 text-gray-700 border-b pb-2 mb-2'
          >
            <p>
              <span className='font-semibold'>Amount:</span> ${offer.cost}
            </p>
            <p>
              <span className='font-semibold'>Location:</span> {offer.location}
            </p>
            <p>
              <span className='font-semibold'>Status:</span> {offer.status}
            </p>
            <p>
              <span className='font-semibold'>Sent on:</span>{' '}
              {new Date(offer.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className='text-red-500'>No offers received yet.</p>
      )}
    </div>
  );
};

export default OfferDetails;
