import Image from 'next/image';

const NotRisky = () => {
  return (
    <section className='my-12 max-w-screen-2xl mx-auto '>
      <div className='flex flex-col lg:flex-row items-center gap-16 bg-[#FAFAFA]'>
        {/* Image on the left, taking 1/4 width on large screens */}
        <div className='w-full lg:w-1/4 flex justify-center'>
          <Image
            src='/home/sick-globe.png'
            alt='No Risky Image'
            className='object-contain'
            width={400}
            height={400}
          />
        </div>

        {/* Text content on the right */}
        <div className='w-full lg:w-3/4 px-6'>
          <h1 className='text-2xl lg:text-3xl  font-semibold mb-4'>
            Cosmetic Surgery Doesn&apos;t Have to Be Risky
          </h1>
          <p className=' leading-relaxed text-base'>
            Arranging cosmetic surgery can feel stressful and uncertain. Hidden
            fees, misleading reviews, and unverified providers are common,
            especially if you consider options abroad. Without proper
            safeguards, you&apos;re often left vulnerable. <br />{' '}
            SurgeryTrust.com solves this by verifying surgeons, clarifying costs
            upfront, and protecting your payment through escrow. Post your
            request, invite unlimited surgeons, compare transparent quotes, and
            communicate freely. We hold your payment securely, releasing funds
            only after you confirm you&apos;re fully satisfied with your care.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotRisky;
