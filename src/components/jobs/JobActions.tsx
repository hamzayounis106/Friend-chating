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
        if (onClose) onClose();
      } else {
        toast.error('Failed to close job');
      }
    } catch (error: any) {
      console.error('Error closing job:', error);
      
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
      <div className='bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-t border-gray-200 flex justify-end gap-4 items-center shadow-inner'>
        {isJobClosed && (
          <div className='mr-auto p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm'>
            <p className='text-gray-600 text-sm flex items-center font-medium'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              This job is closed for new applications
            </p>
          </div>
        )}

        {isCreator && !isJobClosed && (
          <button
            className={`px-5 py-3 ${
              isClosing 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg'
            } rounded-lg transition-all duration-200 font-medium flex items-center`}
            onClick={openConfirmationModal}
            disabled={isClosing}
          >
            {isClosing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Closing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Job
              </>
            )}
          </button>
        )}

        {isSurgeon && !isJobClosed && (
          <button
            className='px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors duration-200 shadow-md hover:shadow-lg font-medium flex items-center'
            onClick={onReply}
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Reply to Job Post
          </button>
        )}

        <button
          className='px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-sm hover:shadow border border-gray-300 font-medium flex items-center'
          onClick={onBack}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all animate-fadeIn">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">
                    Close Job
                  </h3>
                  <p className="text-sm text-red-600 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-5">
              <p className="text-gray-700 leading-relaxed">
                Are you sure you want to close this job? This will:
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li>Cancel all pending offers</li>
                  {/* <li>Make the job no longer visible to surgeons</li> */}
                  <li>Prevent new offers from being submitted</li>
                </ul>
              </p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
                onClick={closeConfirmationModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-md"
                onClick={handleJobClose}
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}