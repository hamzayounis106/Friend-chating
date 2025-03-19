'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Offer {
  _id: string;
  jobId: string;
  cost: number;
  date: string;
  location: string;
  description: string;
  createdBy: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  __v?: number;
}

export default function OffersForSingleJobPost({ jobId }: { jobId: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        if (!jobId) {
          return;
        }
        console.log('Fetching offers for job:', jobId);
        const response = await axios.get(`/api/offers/fetch/${jobId}`);
        setOffers(response.data);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to load offers');
        toast.error('Failed to load offers');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchOffers();
    }
  }, [jobId]);

  //   const handleViewOffer = (patientId: string) => {
  //     if (!session?.user?.id) {
  //       toast.error('You need to be logged in to view this offer');
  //       return;
  //     }

  //     const chatUrl = `/dashboard/chat/${session.user.id}--${offer}--${jobId}`;
  //     router.push(chatUrl);
  //   };

  if (loading) {
    return (
      <div className='p-4 text-center'>
        <div className='animate-pulse flex flex-col space-y-3'>
          <div className='h-4 bg-gray-200 rounded w-1/4 mx-auto'></div>
          <div className='h-24 bg-gray-200 rounded w-full'></div>
          <div className='h-24 bg-gray-200 rounded w-full'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='p-4 text-center text-red-500'>{error}</div>;
  }

  if (offers.length === 0) {
    return (
      <div className='p-4 text-center text-gray-500'>
        No offers available for this job yet.
      </div>
    );
  }

  return (
    <div className='p-6 bg-gray-50'>
      <h3 className='text-xl font-semibold mb-4'>Offers ({offers.length})</h3>
      <div className='space-y-4'>
        {offers.map((offer) => (
          <div
            key={offer._id}
            className='bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow'
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='font-medium text-lg'>
                  ${offer.cost.toLocaleString()}
                </p>
                <p className='text-gray-600 mt-1'>{offer.description}</p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {offer.location}
                  </span>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-3 w-3 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {new Date(offer.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  offer.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : offer.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </span>
            </div>

            <div className='flex mt-4 justify-between items-center'>
              <div className='text-sm text-gray-500'>
                {new Date(offer.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              <Link
                href={`/dashboard/chat/${session?.user?.id}--${offer.createdBy}--${jobId}/offer#${offer._id}`}
                className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                  <path
                    fillRule='evenodd'
                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                    clipRule='evenodd'
                  />
                </svg>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
