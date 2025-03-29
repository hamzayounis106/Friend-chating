'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
  const isGold = id === 'gold';
  const isBronze = id === 'bronze';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg group hover:shadow-xl transition-all duration-300 ${
        isGold
          ? 'bg-[#272439] text-white border-2 border-[#272439]/50 transform scale-105 z-10'
          : isBronze
          ? 'bg-white text-gray-900 border border-gray-100'
          : 'bg-white text-gray-900 border border-gray-100'
      }`}
    >
      {/* Spotlight effect on hover */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
        <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent'></div>
      </div>

      {isGold && (
        <>
          <div className='absolute -right-12 -top-12 w-24 h-24 bg-[#66ccff]/20 rounded-full blur-xl'></div>
          <div className='absolute -left-12 -bottom-12 w-24 h-24 bg-[#66ccff]/20 rounded-full blur-xl'></div>
        </>
      )}

      {/* Featured badge */}
      {isGold && (
        <div className='absolute top-0 right-0'>
          <div className='bg-[#66ccff] text-white py-1 px-4 shadow-md rounded-bl-lg rounded-tr-lg flex items-center text-xs font-bold'>
            <Zap className='h-3 w-3 mr-1' /> POPULAR
          </div>
        </div>
      )}

      {isBronze && (
        <div className='absolute top-0 right-0'>
          <div className='bg-[#272439] text-white py-1 px-4 shadow-md rounded-bl-lg rounded-tr-lg flex items-center text-xs font-bold'>
            <Star className='h-3 w-3 mr-1 fill-white' /> FEATURED
          </div>
        </div>
      )}

      <div className='p-8 relative z-10'>
        {/* Plan title */}
        <div className='text-center mb-6'>
          <div
            className={`inline-block px-4 py-1 rounded-full text-xs font-semibold mb-2 ${
              isGold
                ? 'bg-white/10 text-white'
                : 'bg-[#66ccff]/10 text-[#66ccff]'
            }`}
          >
            {subtitle}
          </div>
          <h3
            className={`text-2xl md:text-3xl font-bold ${
              isGold ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
        </div>

        {/* Price */}
        <div className='text-center mb-6'>
          <div
            className={`text-3xl md:text-4xl font-bold ${
              isGold ? 'text-white' : 'text-[#66ccff]'
            }`}
          >
            ${price}
          </div>
          <p
            className={`text-sm mt-1 ${
              isGold ? 'text-white/70' : 'text-gray-500'
            }`}
          >
            {id === 'gold'
              ? '3 credits to unlock three jobs'
              : id === 'brone'
              ? 'to unlock one job (1 credit)'
              : ' to unlock two job replies (2 credits)'}
          </p>
        </div>

        {/* Description */}
        <p
          className={`text-sm mb-8 text-center ${
            isGold ? 'text-white/80' : 'text-gray-600'
          }`}
        >
          {description}
        </p>

        {/* Divider */}
        <div
          className={`border-t mb-6 ${
            isGold ? 'border-white/20' : 'border-gray-100'
          }`}
        ></div>

        {/* Features list */}
        <ul className='space-y-4 mb-8'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-start'>
              <CheckCircle
                className={`h-5 w-5 mr-3 flex-shrink-0 ${
                  isGold ? 'text-[#66ccff]' : 'text-[#66ccff]'
                }`}
              />
              <span
                className={`text-sm ${
                  isGold ? 'text-white/90' : 'text-gray-700'
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className='mt-8'>
          <Button
            onClick={() => handlePlanSelect(plan)}
            className={`w-full py-6 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] ${
              isGold
                ? 'bg-[#66ccff] hover:bg-[#66ccff]/90 text-white shadow-lg shadow-[#66ccff]/20'
                : 'bg-[#272439] hover:bg-[#272439]/90 text-white shadow-lg shadow-[#272439]/20'
            }`}
          >
            {isGold ? 'Best Value' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
