import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import HomeJobForm from '../HomeJobForm';

const HeroSection = () => {
  return (
    <div className='relative'>
      <section className='w-full bg-[#65C3FF] pb-0'>
        <div className='container mx-auto px-[5%]'>
          <div className='flex flex-col lg:flex-row items-stretch min-h-[600px] lg:gap-8'>
            {/* Text - Left Side */}
            <div className='lg:w-1/2 flex flex-col justify-center space-y-6 text-white py-12'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-start'>
                Trusted Cosmetic <br /> Surgery, Worldwide <br />
              </h1>
              <p className='text-lg md:text-xl max-w-[700px] lg:max-w-a mx-auto lg:mx-0 text-center lg:text-start '>
                Experience peace of mind with verified surgeons, transparent
                costs, and secure payments that safeguard you wherever you
                choose to undergo surgery. Post your procedure, compare
                unlimited quotes, communicate securely and select the best. Pay
                safely via our escrow-platform, where your funds are released
                only after successful surgery is confirmed.
              </p>
            </div>

            {/* Image - Right Side */}
            <div className='lg:w-1/2 flex items-end'>
              <div className='relative w-full h-[300px] sm:h-[400px] lg:h-full'>
                <Image
                  src='/home/hero.png'
                  alt='Plastic Surgery'
                  fill
                  className='object-contain object-bottom'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='container mx-auto px-4'>
        <div
          className='max-w-2xl mx-auto relative -mt-20 md:-mt-10 xl:-mt-24 z-10'
          id='post-job'
        >
          {' '}
          <HomeJobForm />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
// HomeJobForm
