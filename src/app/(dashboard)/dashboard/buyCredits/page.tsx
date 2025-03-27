'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { packages } from '@/lib/packages';
import LoadingSpinner from '@/components/LoadingSpinner';
import PricingCard from '@/components/home/pricing/PricingCard';

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
    <div className=' mx-auto  max-w-6xl'>
      <div className='mb-12 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-3'>
          Credit Packages
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Purchase premium credit packages for exclusive consultations with our
          top surgeons
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {packages.map((pkg) => (
          <PricingCard key={pkg.id} plan={pkg} />
        ))}
      </div>
    </div>
  );
}
