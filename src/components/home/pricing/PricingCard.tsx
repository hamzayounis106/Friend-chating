'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PackageType } from '@/lib/packages';

const PricingCard = ({ plan }: { plan: PackageType }) => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (selectedPlan: PackageType) => {
    setLoading(true);
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    router.push(
      `/checkout/package?package=${encodeURIComponent(
        JSON.stringify({ title: selectedPlan.title, type: 'pricing' })
      )}`
    );
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  const { id, title, subtitle, description, features, price } = plan;
  const isBronze = id === 'bronze';

  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md py-6 px-4 transition-transform duration-300 group ${
        isBronze ? 'bg-[#1B192A] text-white' : 'bg-white text-gray-900'
      } cursor-pointer`}
      onClick={() => handlePlanSelect(plan)}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isBronze ? ' ' : ' '
        }`}
      ></div>

      <div className='relative z-10 px-4 sm:px-6'>
        <div className='mb-4'>
          <h2
            className={`text-center text-xl font-bold p-2 rounded-full transition-colors duration-300 ${
              isBronze
                ? 'text-primary bg-white '
                : 'bg-primary text-white '
            }`}
          >
            {subtitle}
          </h2>
          <h3
            className={`text-2xl font-semibold mt-8 transition-colors duration-300 ${
              isBronze ? 'text-white ' : 'text-gray-900 '
            }`}
          >
            {title}
          </h3>
        </div>

        <p
          className={`text-sm mb-6 transition-colors duration-300 ${
            isBronze ? 'text-white ' : 'text-[#949494] '
          }`}
        >
          {description}
        </p>

        <div
          className={`border-t-2 pt-6 transition-colors duration-300 ${
            isBronze ? 'border-white' : 'border-[#7B7992] '
          }`}
        >
          <ul className='space-y-3'>
            {features.map((feature, index) => (
              <li key={index} className='flex items-start'>
                <CheckCircle
                  className={`h-5 w-5 mr-2 transition-colors duration-300 ${
                    isBronze ? 'text-white' : 'text-primary '
                  }`}
                />
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isBronze ? 'text-white ' : 'text-gray-700 '
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-8 text-center'>
          <Button
            className={`w-full font-medium py-2 px-4 rounded-full transition-all duration-300 ${
              isBronze ? 'bg-white text-primary ' : 'bg-primary text-white '
            }`}
          >
            Get It Now For {price}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
