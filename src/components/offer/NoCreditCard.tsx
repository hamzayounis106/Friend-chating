import { AlertCircle, CreditCard, Zap } from 'lucide-react';
import Link from 'next/link';

interface CreditRequiredPromptProps {
  variant: 'chat' | 'offer';
  className?: string;
  linkUrl?: string;
}

export default function CreditRequiredPrompt({
  variant = 'chat',
  className = '',
  linkUrl = '/dashboard/buyCredits',
}: CreditRequiredPromptProps) {
  const config = {
    chat: {
      title: 'Credits Required',
      description:
        'You need to purchase credits to start a chat with this surgeon. Credits allow you to connect with specialists for consultations.',
      icon: <AlertCircle className='w-12 h-12 text-orange-600' />,
      linkText: 'Purchase Credits',
    },
    offer: {
      title: 'Credits Required to View Offer',
      description:
        'You need to purchase credits to view and respond to this surgical offer.',
      icon: <Zap className='w-12 h-12 text-blue-600' />,
      linkText: 'Purchase Credits to View Offer',
    },
  };

  const { title, description, icon, linkText } = config[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 mx-auto ${className}`}
    >
      <div className='mb-6'>{icon}</div>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
        {title}
      </h2>
      <p className='text-gray-600 mb-6 text-center max-w-md'>{description}</p>
      <Link
        href={linkUrl}
        className='flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'
      >
        <CreditCard className='mr-2 h-5 w-5' />
        {linkText}
      </Link>
    </div>
  );
}
