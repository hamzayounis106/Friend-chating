import { packages } from '@/lib/packages';
import React from 'react';
import PricingCard from './PricingCard';

const PricingPlans = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto'>
      {packages.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};

export default PricingPlans;
