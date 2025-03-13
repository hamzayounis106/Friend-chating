'use client';

import React, { useState } from 'react';
import {
  Package,
  Shield,
  Crown,
  CheckCircle,
  CreditCard,
  Loader,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const packages = [
  {
    id: 'bronze',
    title: 'Bronze',
    icon: <Package className='w-10 h-10 text-amber-700' />,
    credits: 1,
    price: 90,
    color: 'bg-amber-100 border-amber-300',
    textColor: 'text-amber-800',
    features: ['Basic access', 'Single consultation'],
  },
  {
    id: 'silver',
    title: 'Silver',
    icon: <Shield className='w-10 h-10 text-slate-500' />,
    credits: 2,
    price: 180,
    color: 'bg-slate-100 border-slate-300',
    textColor: 'text-slate-700',
    features: ['Priority access', 'Two consultations', '10% discount'],
  },
  {
    id: 'gold',
    title: 'Gold',
    icon: <Crown className='w-10 h-10 text-yellow-500' />,
    credits: 3,
    price: 279,
    color: 'bg-yellow-50 border-yellow-300',
    textColor: 'text-yellow-700',
    features: [
      'VIP access',
      'Three consultations',
      'Priority scheduling',
      '15% discount',
    ],
  },
];

export default function CreditPackages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // const handlePurchase = async () => {
  //   const pkg = packages.find((p) => p.id === selectedPackage);
  //   if (!pkg) {
  //     setError('Please select a package');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');
  //   setSuccessMessage('');

  //   try {
  //     const response = await fetch('/api/credit', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         quantity: pkg.credits,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || 'Failed to purchase credits');
  //     }

  //     setSuccessMessage(`Successfully purchased ${pkg.credits} credit(s)!`);
  //     setSelectedPackage(null);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  console.log('pkg', packages[0]);
  const handlePackageSelect = (pkg: any) => {
    const {credits,title,price } = pkg
    // Navigate to the checkout page with the selected package's data
    router.push(`/checkout?package=${encodeURIComponent(JSON.stringify({credits,title,price , type: 'credit'}))}`);
  };

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          Credit Packages
        </h1>
        <p className='text-gray-600'>
          Purchase credit packages for consulting with our expert surgeons
        </p>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      {successMessage && (
        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center'>
          <CheckCircle className='w-5 h-5 mr-2' />
          {successMessage}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border ${pkg.color} rounded-lg p-6 transition-all ${
              selectedPackage === pkg.id
                ? 'ring-4 ring-blue-400 transform scale-105'
                : 'hover:shadow-lg'
            } cursor-pointer`}
            onClick={() => handlePackageSelect(pkg)}
          >
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h2 className={`text-2xl font-bold ${pkg.textColor}`}>
                  {pkg.title}
                </h2>
                <p className='text-gray-600'>
                  {pkg.credits} Credit{pkg.credits > 1 ? 's' : ''}
                </p>
              </div>
              <div>{pkg.icon}</div>
            </div>

            <div className='mb-6'>
              <p className='text-3xl font-bold text-gray-800'>${pkg.price}</p>
              {pkg.id === 'gold' && (
                <p className='text-green-600 text-sm'>Save $31 (10% off)</p>
              )}
            </div>

            <div className='mb-6'>
              <ul>
                {pkg.features.map((feature, index) => (
                  <li key={index} className='flex items-center mb-2'>
                    <CheckCircle className='w-5 h-5 text-green-500 mr-2' />
                    <span className='text-gray-700'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* <button
              className={`w-full py-2 px-4 rounded-md font-medium ${
                selectedPackage === pkg.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              } transition-colors`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
