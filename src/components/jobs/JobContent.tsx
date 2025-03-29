// src/components/jobs/JobContent.tsx
'use client';
import { Briefcase } from 'lucide-react';
import AttachmentsGallery from './AttachmentsGallery';
import { JobContentProps } from './job';

export default function JobContent({
  description,
  attachments,
  locations,
}: JobContentProps) {
  return (
    <div className='px-8 py-10 space-y-8'>
      <div className='bg-white rounded-lg border border-gray-100 shadow-sm p-6'>
        <div className='flex items-center mb-4'>
          <div className='bg-blue-100 p-2 rounded-md mr-3'>
            <svg
              className='h-5 w-5 text-blue-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-semibold text-gray-800'>
            Job Description
          </h2>
        </div>

        <div className='pl-10'>
          <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
            {description}
          </p>
        </div>
      </div>
      <div className='bg-white rounded-lg border border-gray-100 shadow-sm p-6'>
        <div className='flex items-center mb-4'>
          <div className='bg-blue-100 p-2 rounded-md mr-3'>
            <Briefcase />{' '}
          </div>
          <h2 className='text-xl font-semibold text-gray-800'>
            Preffered Locations
          </h2>
        </div>

        <div className='pl-10'>
          <div className='mt-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>
              Locations
            </h3>
            <div className='flex flex-wrap gap-2'>
              {locations.map((location, index) => (
                <div
                  key={index}
                  className='bg-indigo-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium
                  flex items-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-colors'
                >
                  <span className='flex-1 min-w-0 truncate'>{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {attachments && attachments.length > 0 && (
        <div className='bg-white rounded-lg border border-gray-100 shadow-sm p-6'>
          <div className='flex items-center mb-4'>
            <div className='bg-purple-100 p-2 rounded-md mr-3'>
              <svg
                className='h-5 w-5 text-purple-600'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-800'>Attachments</h2>
            <span className='ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
              {attachments.length}
            </span>
          </div>

          <div className='pl-10'>
            <AttachmentsGallery attachments={attachments} />
          </div>
        </div>
      )}
    </div>
  );
}
