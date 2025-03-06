'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OfferFormProps {
  chatPartner: {
    id: string;
    name: string;
    email: string;
  };
  jobId: string;
  userId: string;
}

const OfferForm = ({ chatPartner, jobId, userId }: OfferFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cost: '',
    date: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          jobId,
          senderId: userId,
          receiverId: chatPartner.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit offer');

      router.refresh();
      setFormData({ cost: '', date: '', location: '', message: '' });
    } catch (error) {
      console.error('Offer submission failed:', error);
      alert('Failed to submit offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Cost
          </label>
          <div className='mt-1'>
            <input
              type='number'
              name='cost'
              value={formData.cost}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Proposed Date
          </label>
          <div className='mt-1'>
            <input
              type='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Location
          </label>
          <div className='mt-1'>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md'
              required
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Message to {chatPartner.name}
          </label>
          <div className='mt-1'>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-md h-32'
              required
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400'
      >
        {isSubmitting ? 'Sending...' : 'Send Offer'}
      </button>
    </form>
  );
};

export default OfferForm;
