import {
  ShieldCheck,
  CheckCircle,
  Settings,
  ArrowLeftRight,
  Lock,
  Gauge,
} from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: <Settings size={32} />,
    title: 'Post Your Procedure (Free)',
    para: 'Submit your details and invite as many surgeons as you like at no charge.',
  },
  {
    icon: <ArrowLeftRight size={32} />,
    title: 'Receive & Compare Quotes',
    para: 'Get notified when surgeons reply. Pay one-time fee per procedure to unlock unlimited communication with all responding surgeons.',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Communicate Securely & Clearly',
    para: 'Discuss procedure details, share images, ask questions, and negotiate costs—all conversations are safely recorded.',
  },
  {
    icon: <Lock size={32} />,
    title: 'Book Safely Through Escrow',
    para: 'Select your preferred surgeon and securely deposit your payment. We hold your funds safely until your surgery is complete.',
  },
  {
    icon: <Gauge size={32} />,
    title: 'Confirm Satisfaction, Then Release Funds',
    para: 'Funds are only transferred to your surgeon once you confirm you’ve received the agreed care and service standards. You’re always protected.',
  },
];

const ProcessCards = () => {
  return (
    <section className='py-12 max-w-screen-lg mx-auto'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl text-center mb-8'>
          A Clear, Safe and Trusted Process
        </h2>
        <div className='flex flex-wrap justify-center gap-6'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='bg-primary p-6 text-center text-white rounded-lg  w-[300px] flex flex-col items-center'
            >
              <div className='mb-4'>{step.icon}</div>
              <h3 className='text-lg font-semibold'>{step.title}</h3>
              <p className='mt-2'>{step.para}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessCards;
