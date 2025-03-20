'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

type Surgery = {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  surgeonId: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  jobId: {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
  };
  offerId: {
    _id: string;
    cost: number;
    date: string;
    location: string;
    status: string;
    description: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'waitingForAdminApproval';
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
};

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
    </div>
  );
};

export default function SurgeriesPage() {
  const { data: session, status } = useSession();
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'scheduled' | 'completed' | 'cancelled' | 'waitingForAdminApproval'
  >('scheduled');

  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/surgery');
        setSurgeries(response.data.surgeries);
      } catch (err) {
        console.error('Error fetching surgeries:', err);
        setError('Failed to load surgeries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchSurgeries();
    }
  }, [status]);
  console.log('surgeris to check ✅✅✅✅', surgeries);
  // Group surgeries by status
  const groupedSurgeries = useMemo(() => {
    return {
      scheduled: surgeries.filter((surgery) => surgery.status === 'scheduled'),
      completed: surgeries.filter((surgery) => surgery.status === 'completed'),
      cancelled: surgeries.filter((surgery) => surgery.status === 'cancelled'),
      waitingForAdminApproval: surgeries.filter(
        (surgery) => surgery.status === 'waitingForAdminApproval'
      ),
    };
  }, [surgeries]);
  const showCancelledTab = groupedSurgeries.cancelled.length > 0;
  console.log('showCancelledTab', showCancelledTab);
  if (status === 'loading' || loading) {
    return (
      <div className='flex justify-center items-center h-96'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10'>
        <p className='text-red-500'>{error}</p>
        <button
          className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!surgeries.length) {
    return (
      <div className='text-center py-10'>
        <h2 className='text-2xl font-semibold mb-2'>No Surgeries Found</h2>
        <p className='text-gray-600'>
          {session?.user.role === 'patient'
            ? "You don't have any surgeries yet. Accept an offer to schedule one."
            : "You don't have any surgeries yet."}
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
            <Clock className='w-3 h-3 mr-1' /> Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            <CheckCircle className='w-3 h-3 mr-1' /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
            <XCircle className='w-3 h-3 mr-1' /> Cancelled
          </span>
        );
      case 'waitingForAdminAproval':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
            <Clock className='w-3 h-3 mr-1' /> Waiting Approval
          </span>
        );
      default:
        return null;
    }
  };

  const handleMarkCompleted = async (surgeryId: string) => {
    try {
      const response = await axios.patch('/api/surgery', { surgeryId });

      if (response.status === 200) {
        setSurgeries((prev) =>
          prev.map((surgery) =>
            surgery._id === surgeryId
              ? { ...surgery, status: 'waitingForAdminApproval' }
              : surgery
          )
        );
        toast.success('Surgery submitted for admin approval');
      }
    } catch (error) {
      console.error('Error marking surgery as completed:', error);
      toast.error('Failed to update surgery status');
    }
  };

  const renderSurgeryCard = (surgery: Surgery) => {
    const otherPerson =
      session?.user.role === 'patient' ? surgery.surgeonId : surgery.patientId;

    return (
      <div
        key={surgery._id}
        className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'
      >
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <Link
              className='text-xl font-semibold text-blue-500   underline'
              href={
                (typeof surgery.surgeonId === 'string'
                  ? surgery.surgeonId
                  : surgery.surgeonId._id) === session?.user?.id
                  ? `chat/${session.user.id}--${surgery.patientId._id}--${surgery.jobId._id}/offer`
                  : `chat/${session?.user.id}--${surgery.surgeonId._id}--${surgery?.jobId._id}/offer`
              }
            >
              {surgery.jobId.title}
            </Link>
            {getStatusBadge(surgery.status)}
          </div>

          <div className='flex items-center mb-6'>
            <div className='relative h-10 w-10 rounded-full overflow-hidden mr-3'>
              <Image
                src={otherPerson?.image || '/default.png'}
                alt={otherPerson?.name || 'User'}
                fill
                sizes='(max-width: 48px) 100vw'
                className='object-cover'
              />
            </div>
            <div>
              <p className='font-medium'>{otherPerson?.name}</p>
              <p className='text-sm text-gray-500'>{otherPerson?.email}</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div className='flex items-center'>
              <Calendar className='h-5 w-5 text-gray-400 mr-2' />
              <span>{formatDate(surgery.scheduledDate)} </span>
            </div>

            <div className='flex items-center'>
              <MapPin className='h-5 w-5 text-gray-400 mr-2' />
              <span>{surgery.offerId.location}</span>
            </div>

            <div className='flex items-center'>
              <DollarSign className='h-5 w-5 text-gray-400 mr-2' />
              <span>${surgery.offerId.cost.toLocaleString()}</span>
            </div>
          </div>
          {/* {console.log('sirger ', surgery.offerId)} */}
          <h1>Description of offer</h1>
          <p className='text-gray-700 my-4'>
            {surgery.offerId?.description?.length > 150
              ? `${surgery?.offerId?.description.substring(0, 150)}...`
              : surgery?.offerId?.description}
          </p>
          {session?.user.role === 'surgeon' &&
            surgery.status === 'scheduled' && (
              <div className='mt-4 border-t pt-4'>
                <button
                  onClick={() => handleMarkCompleted(surgery._id)}
                  className='w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'
                >
                  Mark as Completed
                </button>
              </div>
            )}
        </div>
      </div>
    );
  };

  const currentSurgeries = groupedSurgeries[activeTab] || [];

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Surgeries</h1>

      {/* Tab Navigation */}
      <div className='flex border-b border-gray-200 mb-6'>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'scheduled'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled ({groupedSurgeries.scheduled.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'completed'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({groupedSurgeries.completed.length})
        </button>
        {showCancelledTab && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({groupedSurgeries.cancelled.length})
          </button>
        )}
        {groupedSurgeries.waitingForAdminApproval.length > 0 && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'waitingForAdminApproval'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('waitingForAdminApproval')}
          >
            Waiting Approval ({groupedSurgeries.waitingForAdminApproval.length})
          </button>
        )}
      </div>

      {/* Surgery Cards */}
      <div className='space-y-6'>
        {currentSurgeries.length > 0 ? (
          currentSurgeries.map(renderSurgeryCard)
        ) : (
          <div className='text-center py-10'>
            <p className='text-gray-600'>
              {activeTab === 'waitingForAdminApproval'
                ? 'No surgeries waiting for approval'
                : `No ${activeTab} surgeries found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
