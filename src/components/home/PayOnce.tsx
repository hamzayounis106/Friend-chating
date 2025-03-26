import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Headphones, Lock, Verified } from 'lucide-react';
import Image from 'next/image';

export const PayOnce = () => {
  return (
    <div className='bg-white rounded-xl my-12 overflow-hidden max-w-4xl mx-auto px-4 lg:px-0'>
      <div className='flex flex-col md:flex-row'>
        {/* Image Section */}
        <div className='relative w-full md:w-1/2 aspect-[4/3] rounded-xl'>
          <Image
            src='/home/payonce.png'
            alt='Pay Once, Communicate Without Limits'
            fill
            className='object-cover rounded-xl '
          />
        </div>

        {/* Content Section */}
        <div className='w-full md:w-1/2 p-4 sm:p-8 md:p-10 flex flex-col justify-center'>
          <div className='space-y-6'>
            <h2 className='text-3xl  text-gray-900'>
              Pay Once, Communicate Without Limits
            </h2>

            <div className='space-y-5'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Headphones className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Post & Invite Surgeons
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Free and unlimited
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Lock className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Unlock & Communicate
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    single payment per procedure (unlocks all surgeons
                    responses)
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Verified className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Book With confidence
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    Escrow-protected payments included at no additional charge
                  </p>
                </div>
              </div>
            </div>

            <Button className='w-full mt-4' size='lg'>
              Post Your Procedure Now <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
