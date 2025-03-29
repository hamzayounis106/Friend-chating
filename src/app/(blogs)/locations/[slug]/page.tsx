'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import locationData from '@/components/locations/LocationData';
import HomeJobForm from '@/components/home/HomeJobForm';
import RecentArticles from '../../RecentPost';

const SingleLocationPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const location = locationData.find((item) => item.postSlug === slug);

  if (!location) {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh] py-20'>
        <div className='text-center space-y-4 max-w-md mx-auto px-4'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Location Not Found
          </h1>
          <p className='text-gray-600'>
            We couldnt find the location you were looking for.
          </p>
          <Link
            href='/locations'
            className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to all locations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className='flex flex-col items-center'>
      {/* Hero Banner */}
      {/* Simple Blue Header */}
<div className='w-full bg-[#66ccff] py-10 sm:py-12'>
  <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='text-center'>
      <div className='flex items-center justify-center text-sm mb-2 text-white/80'>
        <MapPin className='w-4 h-4 mr-1' />
        <span>Articles</span>
      </div>
      <h1 className='text-3xl md:text-4xl font-bold text-white'>
        {location.postTitle}
      </h1>
      {location.postDate && (
        <div className='mt-3 text-sm text-white/80'>
          <Calendar className="w-4 h-4 mr-1 inline-block" />
          <span>{location.postDate}</span>
        </div>
      )}
    </div>
  </div>
</div>
      {/* <div className='relative w-full h-[40vh] md:h-[50vh] overflow-hidden'>
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `url(${location.featureImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 to-black/20' />
        </div>

        <div className='relative z-10 h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12'>
          <div className='text-white space-y-4'>
            <div className='flex items-center text-sm'>
              <MapPin className='w-4 h-4 mr-1' />
              <span>Locations</span>
            </div>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              {location.postTitle}
            </h1>
            <div className='flex items-center text-sm space-x-4 text-white/80'>
            
            </div>
          </div>
        </div>
      </div> */}

      {/* Breadcrumb */}
      <div className='w-full bg-gray-50 border-b border-gray-100'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <nav className='flex text-sm text-gray-500'>
            <Link href='/' className='hover:text-gray-900'>
              Home
            </Link>
            <span className='mx-2'>/</span>
            <Link href='/locations' className='hover:text-gray-900'>
              Locations
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-gray-900'>{location.postTitle}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Left Column - Content */}
          <div className='flex-1 min-w-0'>
            <article className='prose max-w-none lg:prose-lg'>
              {/* Intro paragraph with larger text */}
              <p className='text-lg md:text-xl text-gray-700 mb-8 font-medium leading-relaxed'>
                {location.postPara1}
              </p>

              {/* Featured image with caption */}
              {location.imageTwo && (
                <figure className='my-8'>
                  <div className='relative w-full h-64 md:h-96 rounded-lg overflow-hidden'>
                    <Image
                      src={location.imageTwo}
                      alt={`Image of ${location.postTitle}`}
                      fill
                      className='object-cover'
                      priority
                    />
                  </div>
                  <figcaption className='text-center text-sm text-gray-500 mt-2'>
                    ${location.postTitle}
                  </figcaption>
                </figure>
              )}
              {/* Content blocks */}
              {location.content.map((block, index) => (
                <div key={index} className='my-8'>
                  {block.type === 'paragraph' && (
                    <p className='text-gray-700'>{block.text}</p>
                  )}

                  {block.type === 'image-paragraph' && (
                    <>
                      <figure className='my-6'>
                        <div className='relative w-full h-64 md:h-96 rounded-lg overflow-hidden'>
                          <Image
                            src={block.image || ''}
                            alt={block.imageAlt || ''}
                            fill
                            className='object-cover'
                          />
                        </div>
                        {block.imageCaption && (
                          <figcaption className='text-center text-sm text-gray-500 mt-2'>
                            {block.imageCaption}
                          </figcaption>
                        )}
                      </figure>
                      {block.text && (
                        <p className='text-gray-700'>{block.text}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
              {/* Main content */}
              <div className='space-y-6'>
                {/* Call to action section */}
                <div className='bg-blue-50 p-6 rounded-lg my-8 border-l-4 border-blue-500'>
                  <h3 className='text-xl font-semibold text-blue-800 mb-2'>
                    Looking for a surgeon in {location.postTitle}?
                  </h3>
                  <p className='text-blue-700 mb-4'>
                    We can help you find the best cosmetic surgeons in this
                    area. Fill out our form to get started.
                  </p>
                  <Link
                    href='#job-form'
                    className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors'
                  >
                    Find a Surgeon
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column - Sidebar */}
          <div className='w-full lg:w-1/3 lg:max-w-xs'>
            <div className='sticky top-8 space-y-8'>
              <div id='job-form'>
                <HomeJobForm />
              </div>
              <div>
                <RecentArticles />
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default SingleLocationPage;
