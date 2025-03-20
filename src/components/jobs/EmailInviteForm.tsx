'use client';

import { mailSender, mainClient } from '@/lib/mail';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface EmailInviteFormProps {
  jobData: {
    _id: string;
    title: string;
    type: string;
    date: string;
  };
  userEmail: string;
  userName: string;
}

export default function EmailInviteForm({
  jobData,
  userEmail,
  userName,
}: EmailInviteFormProps) {
  const [emails, setEmails] = useState('');
  const [isSending, setIsSending] = useState(false);
  console.log('user emails', process.env.MAIL_TRAP_ADMIN_EMAIL);

  const handleSendInvites = async () => {
    setIsSending(true);

    const emailList = emails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '');

    if (emailList.length === 0) {
      toast.error('Please enter at least one email address');
      setIsSending(false);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const jobLink = `${baseUrl}/job-post/${jobData._id}`;

    try {
      const response = await fetch('/api/send-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: jobData.title,
          jobType: jobData.type,
          jobDate: jobData.date,
          invitedSurgeons: emailList,
          userName,
          userEmail,
          link: jobLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      toast.success('Admin notified successfully');
      setEmails('');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className='w-full space-y-2'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder='Enter surgeon emails (comma-separated)'
          className='flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          disabled={isSending}
        />
        <button
          onClick={handleSendInvites}
          disabled={isSending}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
        >
          {isSending ? 'Sending...' : 'Notify Admin'}
        </button>
      </div>
      <p className='text-sm text-gray-500'>
        Admin (ahmadeveloper077@gmail.com) will receive notification with
        details
      </p>
    </div>
  );
}
