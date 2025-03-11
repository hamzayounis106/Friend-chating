import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import { Session } from 'next-auth';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const OfferDetails = ({
  offerDetails,
  offerSender,
}: {
  offerDetails: OfferType[];
  offerSender: Session['user'] | null;
}) => {
  // Get status icon based on offer status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case 'declined':
        return <XCircle className='h-5 w-5 text-red-500' />;
      case 'pending':
        return <Clock className='h-5 w-5 text-amber-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-gray-500' />;
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200'>
        <h3 className='text-lg font-bold text-gray-800 flex items-center'>
          <DollarSign className='h-5 w-5 mr-2 text-indigo-600' />
          Your Offers
        </h3>
        {offerSender && (
          <div className='flex items-center mt-2 text-sm text-gray-600'>
            <User className='h-4 w-4 mr-1 text-gray-400' />
            <span>Sent by you</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className='p-6'>
        {offerDetails.length > 0 ? (
          <div className='space-y-6'>
            {offerDetails.map((offer, index) => (
              <div
                key={offer._id}
                className={`rounded-lg border ${
                  index !== offerDetails.length - 1 ? 'mb-6' : ''
                } ${
                  offer.status.toLowerCase() === 'accepted'
                    ? 'border-green-200 bg-green-50'
                    : offer.status.toLowerCase() === 'declined'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Offer Header with Status */}
                <div className='px-4 py-3 flex justify-between items-center border-b border-gray-200 bg-white bg-opacity-60'>
                  <div className='flex items-center'>
                    {getStatusIcon(offer.status)}
                    <span
                      className={`ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full ${getStatusColorClass(
                        offer.status
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    Sent {formatDate(offer.createdAt)}
                  </span>
                </div>

                {/* Offer Details */}
                <div className='p-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Cost */}
                    <div className='flex items-start'>
                      <div className='bg-blue-100 rounded-full p-2 mt-1 mr-3'>
                        <DollarSign className='h-4 w-4 text-blue-600' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 mb-1'>
                          Offer Amount
                        </p>
                        <p className='font-semibold text-lg text-gray-900'>
                          {formatCurrency(offer.cost)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className='flex items-start'>
                      <div className='bg-indigo-100 rounded-full p-2 mt-1 mr-3'>
                        <MapPin className='h-4 w-4 text-indigo-600' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 mb-1'>Location</p>
                        <p className='font-medium text-gray-900'>
                          {offer.location || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Surgery Date */}
                    <div className='flex items-start'>
                      <div className='bg-green-100 rounded-full p-2 mt-1 mr-3'>
                        <Calendar className='h-4 w-4 text-green-600' />
                      </div>
                      <div>
                        <p className='text-xs text-gray-500 mb-1'>
                          Expected Surgery Date
                        </p>
                        <p className='font-medium text-gray-900'>
                          {formatDate(offer.expectedSurgeoryDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action section based on status */}
                {offer.status.toLowerCase() === 'accepted' && (
                  <div className='px-4 py-3 bg-green-100 border-t border-green-200 flex items-center'>
                    <CheckCircle className='h-4 w-4 text-green-600 mr-2' />
                    <span className='text-sm text-green-700'>
                      This offer has been accepted. Surgery is scheduled.
                    </span>
                  </div>
                )}

                {offer.status.toLowerCase() === 'declined' && (
                  <div className='px-4 py-3 bg-red-100 border-t border-red-200 flex items-center'>
                    <XCircle className='h-4 w-4 text-red-600 mr-2' />
                    <span className='text-sm text-red-700'>
                      This offer has been declined by the patient.
                    </span>
                  </div>
                )}

                {offer.status.toLowerCase() === 'pending' && (
                  <div className='px-4 py-3 bg-amber-50 border-t border-amber-200 flex items-center'>
                    <Clock className='h-4 w-4 text-amber-600 mr-2' />
                    <span className='text-sm text-amber-700'>
                      Awaiting patient response to your offer.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <div className='mx-auto rounded-full bg-gray-100 p-3 w-16 h-16 flex items-center justify-center mb-4'>
              <DollarSign className='h-8 w-8 text-gray-400' />
            </div>
            <h4 className='text-lg font-medium text-gray-800 mb-1'>
              No offers yet
            </h4>
            <p className='text-gray-500 max-w-sm mx-auto'>
              You haven&apos;t created any offers for this job yet. Create an
              offer to connect with the patient.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;
