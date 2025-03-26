'use client';

import { mailSender, mainClient } from '@/lib/mail';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { Input } from '../ui/input';
import Button from '../ui/button';

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
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (emails.includes(email)) {
      toast.error('This email has already been added');
      return;
    }

    setEmails([...emails, email]);
    setEmailInput('');
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) {
      toast.error('Please add at least one email address');
      return;
    }

    setIsSending(true);
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
          invitedSurgeons: emails,
          userName,
          userEmail,
          link: jobLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      toast.success('Invitations sent successfully');
      setEmails([]);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to send invitations');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className='w-full space-y-2'>
      <label className='flex items-center text-sm font-medium text-gray-700'>
        <span className='w-4 h-4 mr-2'>✉️</span>
        Surgeon Emails
      </label>

      <div className='relative flex items-center justify-center gap-2'>
        <Input
          type='text'
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter surgeon email'
          className='w-full '
          disabled={isSending}
        />
        {/* <button
          type='button'
          onClick={handleAddEmail}
          className='ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
          disabled={isSending}
        >
          Add
        </button> */}
        <Button
          onClick={handleSendInvites}
          disabled={isSending || emails.length === 0}
          className={` ${
            isSending
              ? 'bg-blue-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isSending ? 'Sending Invites...' : 'Notify Admin & Send Invites'}
        </Button>
      </div>

      {/* Email bubbles */}
      <div className='flex flex-wrap gap-2 mt-2'>
        {emails.map((email, index) => (
          <div
            key={index}
            className='flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm'
          >
            {email}
            <button
              type='button'
              onClick={() => handleRemoveEmail(index)}
              className='ml-2 text-indigo-500 hover:text-indigo-700'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
