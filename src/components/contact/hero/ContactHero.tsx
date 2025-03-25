import Image from 'next/image';

const ContactHero = () => {
  return (
    <div className='relative w-full lg:min-h-[100vh]'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/home/hero.png'
          alt='Plastic Surgery'
          fill
          className='object-cover lg:object-[center_top]' // Modified here
          priority
          quality={100}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
        />
        <div className='absolute inset-0 bg-gray-900/50' />
      </div>

      {/* Content Container */}
      <div className='relative z-10 container mx-auto px-4 h-full'>
        <div className='flex flex-col lg:flex-row items-stretch min-h-[600px]'>
          {/* Text - Left Side - Takes full width on mobile, half on desktop */}
          <div className='w-full lg:w-1/2 flex flex-col justify-center space-y-6 text-white py-12 px-4 lg:px-0'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-start'>
              We Are Here <br /> To Help You!
            </h1>
            <p className='text-lg md:text-xl max-w-[700px] lg:max-w-none mx-auto lg:mx-0 text-center lg:text-start'>
              Your beauty, our expertise, with care, precision, and personalized
              attention to enhance your confidence and achieve natural, stunning
              results that make you look and feel your absolute best.
            </p>
          </div>

          {/* Right Side - Empty on purpose to balance layout */}
          <div className='hidden lg:block lg:w-1/2'></div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;
