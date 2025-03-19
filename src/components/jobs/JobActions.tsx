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

  const handleJobClose = async () => {
    // Confirm before closing
    const confirmed = window.confirm(
      'Are you sure you want to close this job? This will cancel all pending offers.'
    );
    
    if (!confirmed) return;
    
    setIsClosing(true);
    
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
    <div className='bg-gray-50 p-8 border-t border-gray-200 flex justify-end gap-4'>
      {isCreator && !isJobClosed && (
        <button
          className={`px-5 py-3 ${
            isClosing ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-100 hover:bg-red-200'
          } text-red-700 rounded-lg transition-colors duration-200`}
          onClick={handleJobClose}
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
  );
}