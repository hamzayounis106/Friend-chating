// src/components/jobs/JobActions.tsx
'use client';

import { JobActionsProps } from './job';

export default function JobActions({
  isCreator,
  isSurgeon,
  isJobClosed,
  jobId,
  onClose,
  onReply,
  onBack,
}: JobActionsProps) {
  return (
    <div className='bg-gray-50 p-8 border-t border-gray-200 flex justify-end gap-4'>
      {isCreator && (
        <button
          className='px-5 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200'
          onClick={onClose}
        >
          Close Job
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
        <p className='text-gray-500 text-sm'>
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
