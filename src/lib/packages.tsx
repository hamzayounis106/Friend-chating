import { Shield, Crown, Package } from 'lucide-react';
import { JSX } from 'react';
export interface PackageType {
  id: string;
  title: string;
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
    icon: <Package className='w-10 h-10 text-amber-700' />,
    credits: 1,
    price: 95,
    color: 'bg-amber-100 border-amber-300',
    textColor: 'text-amber-800',
    features: ['Basic access', 'Single consultation'],
  },
  {
    id: 'silver',
    title: 'Silver',
    icon: <Shield className='w-10 h-10 text-slate-500' />,
    credits: 2,
    price: 125,
    color: 'bg-slate-100 border-slate-300',
    textColor: 'text-slate-700',
    features: ['Priority access', 'Two consultations', '10% discount'],
  },
  {
    id: 'gold',
    title: 'Gold',
    icon: <Crown className='w-10 h-10 text-yellow-500' />,
    credits: 3,
    price: 145,
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
