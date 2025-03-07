'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface OfferType {
  _id: string;
  cost: number;
  status: string;
  createdAt: Date | string;
  createdBy: string;
  jobId: string;
  location: string;
  expectedSurgeoryDate: string;
}

const OfferResponse = ({
  offerDetails,
}: {
  offerDetails: OfferType | null;
}) => {
  const [status, setStatus] = useState(offerDetails?.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: 'accepted' | 'declined') => {
    if (!offerDetails) return;

    setLoading(true);
    try {
      const res = await axios.patch(`/api/offers/${offerDetails._id}`, {
        status: newStatus,
      });

      if (res.status === 200) {
        setStatus(newStatus);
        toast.success(`Offer ${newStatus} successfully`);
      } else {
        console.error('Failed to update offer status');
        toast.error('Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Error updating offer');
    }
    setLoading(false);
  };

  return (
    <div className='bg-gray-100 p-4 rounded-md'>
      <h3 className='text-lg font-semibold'>Offer Details</h3>
      {offerDetails ? (
        <div className='mt-2 text-gray-700'>
          <p>
            <span className='font-semibold'>Amount:</span> ${offerDetails.cost}
          </p>
          <p>
            <span className='font-semibold'>Location:</span>{' '}
            {offerDetails.location}
          </p>
          <p>
            <span className='font-semibold'>Status:</span> {status}
          </p>
          <p>
            <span className='font-semibold'>Sent on:</span>{' '}
            {new Date(offerDetails.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className='font-semibold'>Expected Surgeory Date:</span>{' '}
            {new Date(offerDetails.expectedSurgeoryDate).toLocaleDateString()}
          </p>

          {/* Action Buttons */}
          {status === 'pending' && (
            <div className='mt-4 flex space-x-4'>
              <button
                className='bg-green-500 text-white px-4 py-2 rounded-md'
                disabled={loading}
                onClick={() => handleStatusChange('accepted')}
              >
                {loading ? 'Processing...' : 'Accept'}
              </button>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-md'
                disabled={loading}
                onClick={() => handleStatusChange('declined')}
              >
                {loading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className='text-red-500'>No offer received yet.</p>
      )}
    </div>
  );
};

export default OfferResponse;
