// src/components/jobs/AttachmentsGallery.tsx
'use client';
import Image from 'next/image';

export default function AttachmentsGallery({
  attachments,
}: {
  attachments: string[];
}) {
  return (
    <div>
      <h3 className='text-xl font-semibold text-gray-800 mb-3'>Attachments</h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {attachments.map((url, idx) => (
          <AttachmentItem key={idx} url={url} />
        ))}
      </div>
    </div>
  );
}

function AttachmentItem({ url }: { url: string }) {
  const isVideo =
    url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm');

  return (
    <div className='relative h-64 bg-gray-100 rounded-lg overflow-hidden shadow-md'>
      {isVideo ? (
        <video
          src={url}
          controls
          className='object-cover w-full h-full cursor-pointer'
          onClick={() => window.open(url, '_blank')}
        />
      ) : (
        <Image
          src={url}
          alt={`Attachment`}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover cursor-pointer transition-transform duration-300 hover:scale-105'
          onClick={() => window.open(url, '_blank')}
        />
      )}
    </div>
  );
}
