'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { updateOfferStatus as updateOfferStatusAction } from '@/store/slices/offerSlice';
import {
  Check,
  X,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { OfferType } from '@/app/(dashboard)/dashboard/chat/[chatId]/offer/page';
import { useRouter } from 'next/navigation';

const OfferResponse = ({
  offerDetails,
}: {
  offerDetails: OfferType | null;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleStatusChange = async (newStatus: 'accepted' | 'declined') => {
    if (!offerDetails) return;

    if (newStatus === 'accepted') {
      router.push(
        `/checkout/offer?offer=${encodeURIComponent(
          JSON.stringify(offerDetails)
        )}`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(`/api/offers/${offerDetails._id}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        dispatch(
          updateOfferStatusAction({
            offerId: offerDetails._id,
            status: newStatus,
          })
        );
        toast.success(`Offer ${newStatus} successfully`);
      } else {
        toast.error('Failed to update offer status');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Error updating offer');
    }
    setLoading(false);
  };

  const getStatusBadge = () => {
    switch (offerDetails?.status?.toLowerCase()) {
      case 'accepted':
        return (
          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
            <Check className='w-4 h-4 mr-1' />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'>
            <X className='w-4 h-4 mr-1' />
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800'>
            <Clock className='w-4 h-4 mr-1' />
            Pending Response
          </span>
        );
    }
  };

  if (!offerDetails) {
    return (
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center'>
        <div className='mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
          <AlertCircle className='w-6 h-6 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-800 mb-1'>
          No Offers Yet
        </h3>
        <p className='text-gray-500'>
          No offers have been received for this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
        <h3 className='text-lg font-bold text-gray-800'>
          Surgeon&apos;s Offer
        </h3>
        {getStatusBadge()}
      </div>

      {/* Body */}
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Cost */}
          <div className='flex items-start'>
            <div className='bg-green-100 rounded-full p-2 mt-1 mr-3'>
              <DollarSign className='h-4 w-4 text-green-600' />
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Offer Amount</p>
              <p className='font-semibold text-lg text-gray-900'>
                {offerDetails?.cost
                  ? formatCurrency(offerDetails.cost)
                  : 'Not specified'}
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
                {offerDetails.location}
              </p>
            </div>
          </div>

          {/* Expected Surgery Date */}
          <div className='flex items-start'>
            <div className='bg-blue-100 rounded-full p-2 mt-1 mr-3'>
              <Calendar className='h-4 w-4 text-blue-600' />
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>
                Expected Surgery Date
              </p>
              <p className='font-medium text-gray-900'>
                {offerDetails?.expectedSurgeoryDate
                  ? formatDate(offerDetails?.expectedSurgeoryDate)
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className='flex items-start'>
            <div className='bg-amber-100 rounded-full p-2 mt-1 mr-3'>
              <Clock className='h-4 w-4 text-amber-600' />
            </div>
            <div>
              <p className='text-xs text-gray-500 mb-1'>Offer Sent On</p>
              <p className='font-medium text-gray-900'>
                {offerDetails?.createdAt
                  ? formatDate(offerDetails.createdAt)
                  : 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Status-specific messages */}
        {offerDetails.status === 'accepted' && (
          <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-start'>
            <Check className='h-5 w-5 mr-2 mt-0.5' />
            <div>
              <p className='font-medium'>You&apos;ve accepted this offer</p>
              <p className='text-sm mt-1'>
                The surgeon has been notified and will contact you regarding
                next steps.
              </p>
            </div>
          </div>
        )}

        {offerDetails.status === 'declined' && (
          <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start'>
            <X className='h-5 w-5 mr-2 mt-0.5' />
            <div>
              <p className='font-medium'>You&apos;ve declined this offer</p>
              <p className='text-sm mt-1'>
                The surgeon has been notified. You can continue to receive other
                offers for this job.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons for pending offers */}
        {offerDetails.status === 'pending' && (
          <div className='mt-6'>
            <div className='p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 mb-4 flex items-start'>
              <Clock className='h-5 w-5 mr-2 mt-0.5' />
              <div>
                <p className='font-medium'>This offer requires your response</p>
                <p className='text-sm mt-1'>
                  Please accept or decline this offer to proceed with your
                  surgery planning.
                </p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                className='flex-1 flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:bg-green-300 disabled:cursor-not-allowed'
                disabled={loading}
                onClick={() => handleStatusChange('accepted')}
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className='w-4 h-4 mr-2' />
                    Accept Offer
                  </>
                )}
              </button>

              <button
                className='flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed'
                disabled={loading}
                onClick={() => handleStatusChange('declined')}
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-red-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <X className='w-4 h-4 mr-2' />
                    Decline Offer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferResponse;
