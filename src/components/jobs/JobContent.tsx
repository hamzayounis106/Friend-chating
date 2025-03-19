// src/components/jobs/JobContent.tsx
'use client';
import AttachmentsGallery from './AttachmentsGallery';
import { JobContentProps } from './job';

export default function JobContent({
  description,
  attachments,
}: JobContentProps) {
  return (
    <div className='p-8 space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
          Description
        </h2>
        <p className='text-gray-700 leading-relaxed'>{description}</p>
      </div>
      {attachments && <AttachmentsGallery attachments={attachments} />}
    </div>
  );
}
