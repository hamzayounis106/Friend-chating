'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { packages } from '@/lib/packages';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CreditPackages() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePackageSelect = async (pkg: any) => {
    console.log('pck to checkkk is sdjkfdfdddddddddddddddddddd', pkg);
    setLoading(true); // Start loading

    const { title } = pkg;
    router.push(
      `/checkout/package?package=${encodeURIComponent(
        JSON.stringify({ title, type: 'credit' })
      )}`
    );
  };

  // Reset loading when route changes
  useEffect(() => {
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
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

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border ${pkg.color} rounded-lg p-6 transition-all  cursor-pointer`}
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
          </div>
        ))}
      </div>
    </div>
  );
}
