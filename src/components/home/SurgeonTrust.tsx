import { Button } from '@/components/ui/button';
import { Check, Shield, Eye, FileBadge, HeartHandshake } from 'lucide-react';
import Image from 'next/image';

const SurgeonTrust = () => {
  return (
    <div className='bg-white rounded-xl  overflow-hidden max-w-4xl mx-auto my-12'>
      <h2 className='text-3xl font-bold text-foreground text-center my-4'>
        Why SURGEONTRUST.COM
      </h2>

      <div className='flex flex-col md:flex-row'>
        {/* Content Section - Now on LEFT */}
        <div className='w-full md:w-1/2 p-4 md:p-10 flex flex-col justify-center order-1 md:order-none'>
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Check className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Unlimited Choices
                  </h3>
                  <p className='text-muted-foreground'>
                    Invite multiple surgeons to ensure the best possible quotes
                    and care.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <FileBadge className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Verified Providers
                  </h3>
                  <p className='text-muted-foreground'>
                    We carefully check surgeon credentials, reputation, and
                    patient experiences.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Eye className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Transparent Costs
                  </h3>
                  <p className='text-muted-foreground'>
                    No hidden fees. We ensure all costs are clarified upfront.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <Shield className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Escrow Security
                  </h3>
                  <p className='text-muted-foreground'>
                    Payments remain safe and secure until after your procedure.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='bg-primary p-3 rounded mt-1'>
                  <HeartHandshake className='h-7 w-7 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    Dispute Support
                  </h3>
                  <p className='text-muted-foreground'>
                    All communications are documented, ensuring you have clear
                    support if issues arise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section - Now on RIGHT */}
        {/* <div className='relative w-full md:w-1/2 aspect-[964/550] order-2 md:order-none'>
          <Image
            src='/home/surgeonTrustSection/one.png'
            alt='Why SURGEONTRUST.COM'
            fill
            className='object-cover'
            priority
          />
        </div> */}
        <div className='relative w-full md:w-1/2 order-2 md:order-none p-4 md:mt-8'>
          {/* First Row - Two Images */}
          <div className='flex gap-4 mb-4'>
            <div className='relative w-1/2 h-80'>
              <Image
                src='/home/surgeonTrustSection/one.png'
                alt='Why SURGEONTRUST.COM'
                fill
                className='object-cover rounded-lg '
                priority
              />
            </div>
            <div className='relative w-1/2 h-80'>
              <Image
                src='/home/surgeonTrustSection/two.png'
                alt='Verified Providers'
                fill
                className='object-cover rounded-lg'
              />
            </div>
          </div>

          {/* Second Row - Full Width Image */}
          <div className='relative w-full h-40'>
            <Image
              src='/home/surgeonTrustSection/three.png'
              alt='Transparent Process'
              fill
              className='object-cover rounded-lg'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeonTrust;
