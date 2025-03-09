'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Check, X, Clock, DollarSign, MapPin, Calendar, AlertCircle } from 'lucide-react';

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

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date function
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status badge based on current status
  const getStatusBadge = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Check className="w-4 h-4 mr-1" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending Response
          </span>
        );
    }
  };

  if (!offerDetails) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">No Offers Yet</h3>
        <p className="text-gray-500">No offers have been received for this job yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Surgeon's Offer</h3>
        {getStatusBadge()}
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost */}
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mt-1 mr-3">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Offer Amount</p>
              <p className="font-semibold text-lg text-gray-900">
                {formatCurrency(offerDetails.cost)}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start">
            <div className="bg-indigo-100 rounded-full p-2 mt-1 mr-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900">
                {offerDetails.location}
              </p>
            </div>
          </div>

          {/* Expected Surgery Date */}
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mt-1 mr-3">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Expected Surgery Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(offerDetails.expectedSurgeoryDate)}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start">
            <div className="bg-amber-100 rounded-full p-2 mt-1 mr-3">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Offer Sent On</p>
              <p className="font-medium text-gray-900">
                {formatDate(offerDetails.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Status-specific messages */}
        {status === 'accepted' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">You've accepted this offer</p>
              <p className="text-sm mt-1">The surgeon has been notified and will contact you regarding next steps.</p>
            </div>
          </div>
        )}
        
        {status === 'declined' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
            <X className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">You've declined this offer</p>
              <p className="text-sm mt-1">The surgeon has been notified. You can continue to receive other offers for this job.</p>
            </div>
          </div>
        )}

        {/* Action Buttons for pending offers */}
        {status === 'pending' && (
          <div className="mt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 mb-4 flex items-start">
              <Clock className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">This offer requires your response</p>
                <p className="text-sm mt-1">Please accept or decline this offer to proceed with your surgery planning.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => handleStatusChange('accepted')}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Accept Offer
                  </>
                )}
              </button>
              
              <button
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => handleStatusChange('declined')}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
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