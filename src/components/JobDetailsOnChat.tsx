import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  Tag,
  FileText,
  User,
  Mail,
  Paperclip,
  Clock,
} from 'lucide-react';

interface JobDetailsOnChatProps {
  job: {
    title: string;
    type: string;
    date: string;
    description: string;
    patientId?: {
      name: string;
      email: string;
      image: string;
      _id: string;
    };
    createdBy: string;
    AttachmentUrls: string[];
    surgeonEmails: { email: string }[];
  };
  userRole: string;
}

const JobDetailsOnChat: React.FC<JobDetailsOnChatProps> = ({
  job,
  userRole,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getFileTypeIcon = (url: string) => {
    if (url.match(/\.(png|jpe?g)$/)) {
      return '🖼️';
    } else if (url.endsWith('.mp4')) {
      return '🎥';
    } else if (url.endsWith('.pdf')) {
      return '📄';
    } else if (url.match(/\.(doc|docx)$/)) {
      return '📝';
    } else {
      return '📎';
    }
  };

  return (
    <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200'>
        <h1 className='text-xl font-bold text-gray-800 flex items-center'>
          <FileText className='h-5 w-5 mr-2 text-indigo-600' />
          Job Details
        </h1>
        <p className='text-sm text-gray-600 mt-1'>
          Information about this cosmetic surgery request
        </p>
      </div>

      {/* Title Section */}
      <div className='p-5 border-b border-gray-200 bg-white'>
        <h2 className='text-lg font-semibold text-gray-800'>{job.title}</h2>
        <div className='flex flex-wrap items-center gap-3 mt-2'>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            <Tag className='w-3 h-3 mr-1' />
            {job.type}
          </span>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            <Calendar className='w-3 h-3 mr-1' />
            {formatDate(job.date)}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Patient Info */}
        {job.patientId && (
          <div className='flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100'>
            <div className='relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0'>
              <Image
                src={job.patientId.image || '/default.png'}
                alt={job.patientId.name}
                fill
                sizes='(max-width: 768px) 100vw, 24px'
                className='rounded-full object-cover'
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 className='font-medium text-gray-800 flex items-center'>
                <User className='w-4 h-4 mr-1 text-gray-500' />
                {job.patientId.name}
              </h3>
              <p className='text-sm text-gray-600 flex items-center mt-1'>
                <Mail className='w-4 h-4 mr-1 text-gray-400' />
                {job.patientId.email}
              </p>
            </div>
          </div>
        )}

        {/* Creator Info - Only shown if not surgeon */}
        {/* {userRole !== 'surgeon' && (
          <div className='p-4 rounded-lg bg-gray-50 border border-gray-100'>
            <h3 className='text-sm font-medium text-gray-500'>Created By</h3>
            <p className='mt-1 font-medium text-gray-800'>
              {job.createdBy}
            </p>
          </div>
        )} */}
      </div>

      {/* Description Section */}
      <div className='px-5 pb-5'>
        <div className='mb-2 font-medium text-gray-800 flex items-center'>
          <FileText className='w-4 h-4 mr-2 text-indigo-600' />
          Description
        </div>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-100'>
          <p className='text-gray-700 whitespace-pre-line'>{job.description}</p>
        </div>
      </div>

      {/* Attachments Section */}
      {job.AttachmentUrls?.length > 0 && (
        <div className='px-5 pb-5 mt-2'>
          <div className='mb-2 font-medium text-gray-800 flex items-center'>
            <Paperclip className='w-4 h-4 mr-2 text-indigo-600' />
            Attachments ({job.AttachmentUrls.length})
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {job.AttachmentUrls.map((url, index) => (
              <div
                key={index}
                className='bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex flex-col'
              >
                {url.match(/\.(png|jpe?g)$/) ? (
                  <div className='relative h-32 w-full bg-gray-200'>
                    <Image
                      src={url || '/default.png'}
                      alt={`Attachment ${index + 1}`}
                      fill
                      sizes='(max-width: 768px) 100vw, 24px'
                      className='object-cover'
                    />
                  </div>
                ) : url.endsWith('.mp4') ? (
                  <video controls className='w-full h-32 bg-gray-900'>
                    <source src={url} type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className='h-32 flex items-center justify-center bg-gray-100'>
                    <span className='text-4xl'>{getFileTypeIcon(url)}</span>
                  </div>
                )}
                <div className='p-2 text-center'>
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium'
                  >
                    View Attachment {index + 1}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surgeon Emails Section - Only shown to patients */}
      {userRole === 'patient' && job.surgeonEmails?.length > 0 && (
        <div className='px-5 pb-5 mt-2'>
          <div className='mb-2 font-medium text-gray-800 flex items-center'>
            <Mail className='w-4 h-4 mr-2 text-indigo-600' />
            Surgeons Invited ({job.surgeonEmails.length})
          </div>
          <div className='bg-gray-50 p-4 rounded-lg border border-gray-100'>
            <ul className='divide-y divide-gray-200'>
              {job.surgeonEmails.map((surgeon, index) => (
                <li key={index} className='py-2 flex items-center'>
                  <div className='h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3'>
                    <User className='h-4 w-4 text-indigo-600' />
                  </div>
                  <span className='text-gray-700'>{surgeon.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsOnChat;
