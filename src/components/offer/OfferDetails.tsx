import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import { Session } from 'next-auth';

const OfferDetails = ({
  offerDetails,
  offerSender,
}: {
  offerDetails: OfferType[];
  offerSender: Session['user'] | null;
}) => {
  return (
    <div className='bg-gray-100 p-4 rounded-md'>
      <h3 className='text-lg font-semibold'>Offer Details</h3>
      {offerDetails.length > 0 ? (
        offerDetails.map((offer) => {
          // Format dates with day, month, and year
          // const formatDate = (dateString: string) => {
          //   const date = new Date(dateString);
          //   return date.toLocaleDateString('en-US', {
          //     weekday: 'long', // e.g., "Wednesday"
          //     month: 'long', // e.g., "March"
          //     day: 'numeric', // e.g., "19"
          //     year: 'numeric', // e.g., "2025"
          //   });
          // };

          return (
            <div
              key={offer._id}
              className='mt-2 text-gray-700 border-b pb-2 mb-2'
            >
              <p>
                <span className='font-semibold'>Amount:</span> ${offer.cost}
              </p>
              <p>
                <span className='font-semibold'>Location:</span>{' '}
                {offer.location}
              </p>
              <p>
                <span className='font-semibold'>Status:</span> {offer.status}
              </p>
              <p>
                <span className='font-semibold'>Sent on:</span>{' '}
                {offer.createdAt}
              </p>
              <p>
                <span className='font-semibold'>Expected Surgery Date:</span>{' '}
                {offer.expectedSurgeoryDate}
              </p>
            </div>
          );
        })
      ) : (
        <p className='text-red-500'>No offers received yet.</p>
      )}
    </div>
  );
};

export default OfferDetails;
