'use client';

import { JobActionsProps } from './job';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function JobActions({
  isCreator,
  isSurgeon,
  isJobClosed,
  jobId,
  onClose,
  onReply,
  onBack,
}: JobActionsProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openConfirmationModal = () => {
    setShowModal(true);
  };

  const closeConfirmationModal = () => {
    setShowModal(false);
  };

  const handleJobClose = async () => {
    setIsClosing(true);
    closeConfirmationModal();
    
    try {
      const response = await axios.patch(`/api/Jobs/${jobId}/close`);
      
      if (response.status === 200) {
        toast.success('Job closed successfully');
        // Call the onClose callback to handle UI updates or navigation
        if (onClose) onClose();
      } else {
        toast.error('Failed to close job');
      }
    } catch (error: any) {
      console.error('Error closing job:', error);
      
      // More detailed error handling
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to close job. Please try again later.');
      }
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <>
      <div className='bg-gray-50 p-8 border-t border-gray-200 flex justify-end gap-4'>
        {isCreator && !isJobClosed && (
          <button
            className={`px-5 py-3 ${
              isClosing ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200'
            } text-red-700 rounded-lg transition-colors duration-200`}
            onClick={openConfirmationModal}
            disabled={isClosing}
          >
            {isClosing ? 'Closing...' : 'Close Job'}
          </button>
        )}

        {isSurgeon && !isJobClosed && (
          <button
            className='px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200'
            onClick={onReply}
          >
            Reply to Job Post
          </button>
        )}

        {isJobClosed && (
          <p className='text-gray-500 text-sm flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            This job is closed for new applications
          </p>
        )}

        <button
          className='px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200'
          onClick={onBack}
        >
          Go Back
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Close Job
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to close this job? This will cancel all pending offers and the job will no longer be visible to surgeons.
              </p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                onClick={closeConfirmationModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                onClick={handleJobClose}
              >
                Close Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}