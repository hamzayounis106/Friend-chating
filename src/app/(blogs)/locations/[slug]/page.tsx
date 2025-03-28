'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import locationData from '@/components/locations/LocationData';

const SingleLocationPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const location = locationData.find((item) => item.postSlug === slug);

  if (!location) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl font-semibold text-gray-700'>
        Location Not Found 😢
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        {location?.postTitle}
      </h1>
      <p className='text-gray-500 text-center'>{location?.postDate}</p>

      <div className='grid md:grid-cols-2 gap-4 mt-6'>
        <div className='relative w-full h-64'>
          <Image
            src={location?.featureImage}
            alt={`Feature image for ${location?.postTitle}`}
            fill
            style={{ objectFit: 'cover' }}
            className='rounded-lg shadow-md'
          />
        </div>

        {location.imageTwo && (
          <div className='relative w-full h-64'>
            <Image
              src={location?.imageTwo}
              alt={`Secondary image for ${location?.postTitle}`}
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-lg shadow-md'
            />
          </div>
        )}
      </div>

      <div className='mt-6 space-y-4'>
        <p className='text-gray-700 text-lg'>{location?.postPara1}</p>
        <p className='text-gray-700 text-lg'>{location?.postPara2}</p>
      </div>
    </div>
  );
};

export default SingleLocationPage;
