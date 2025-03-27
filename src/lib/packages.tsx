import { Shield, Crown, Package } from 'lucide-react';
import { JSX } from 'react';

export interface PackageType {
  id: string;
  title: string;
  subtitle: string; // Added from pricingPlansData
  description: string; // Added from pricingPlansData
  icon: JSX.Element;
  credits: number;
  price: number;
  color: string;
  textColor: string;
  features: string[];
}

export const packages: PackageType[] = [
  {
    id: 'bronze',
    title: 'Bronze',
    subtitle: 'Simple', // Added from pricingPlansData
    description:
      'Unlock one procedure and save 30% instantly. A perfect start for subtle enhancements with expert care at a great price!', // Added
    icon: <Package className='w-10 h-10 text-amber-700' />,
    credits: 1,
    price: 95,
    color: 'bg-amber-100 border-amber-300',
    textColor: 'text-amber-800',
    features: [
      'Invite Unlimited Surgeons to Quote',
      'Unlock all surgeons replies for a single procedure',
      'Secure surgery payment with escrow protection',
      'Ensure a Safer & More Transparent surgery process',
      'No hidden costs',
    ],
  },
  {
    id: 'silver',
    title: 'Silver',
    subtitle: 'Save 35%', // Added from pricingPlansData
    description:
      'Unlock two procedures and save 35% instantly. A perfect start for subtle enhancements with expert care at a great price!', // Added
    icon: <Shield className='w-10 h-10 text-slate-500' />,
    credits: 2,
    price: 125,
    color: 'bg-slate-100 border-slate-300',
    textColor: 'text-slate-700',
    features: [
      'Unlock replies for 2 different procedures anytime',
      'Invite Unlimited Surgeons to Quote',
      'Secure surgery payment with escrow protection',
      'Ensure a Safer & More Transparent surgery process',
      'No hidden costs',
    ],
  },
  {
    id: 'gold',
    title: 'Gold',
    subtitle: 'Save 50%', // Added from pricingPlansData
    description:
      'Unlock three procedures and save 50% instantly. A perfect start for subtle enhancements with expert care at a great price!', // Added
    icon: <Crown className='w-10 h-10 text-yellow-500' />,
    credits: 3,
    price: 145,
    color: 'bg-yellow-50 border-yellow-300',
    textColor: 'text-yellow-700',
    features: [
      'Unlock replies for 3 different procedures anytime',
      'Invite Unlimited surgeons to Quote',
      'Secure surgery payment with escrow protection',
      'Ensure a Safer & More Transparent surgery process',
      'No hidden costs',
    ],
  },
];
