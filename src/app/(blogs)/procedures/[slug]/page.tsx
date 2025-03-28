'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import proceduresData from '@/components/procedures/proceduresData';
import HomeJobForm from '@/components/home/HomeJobForm';
import RecentBlogPosts from '../../RecentPost';

const SingleProcedurePage = () => {
  const params = useParams();
  const slug = params?.slug;
  const procedure = proceduresData.find((item) => item.postSlug === slug);

  if (!procedure) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl font-semibold text-gray-700'>
        Procedure Not Found 😢
      </div>
    );
  }

  return (
    <section>
      {/* Hero Section */}
      <div className='relative w-full min-h-[80vh]'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={procedure.featureImage}
            alt={procedure.postTitle}
            fill
            className='object-cover'
            priority
            quality={100}
            sizes='100vw'
            placeholder='blur'
            blurDataURL='data:image/svg+xml;base64'
          />
          <div className='absolute inset-0 bg-primary opacity-40' />
        </div>

        <div className='relative w-full min-h-[80vh]'>
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 text-white'>
            <p className='text-2xl sm:text-3xl font-medium'>Category</p>
            <h1 className='text-3xl font-semibold sm:text-5xl'>Procedures</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='container mx-auto px-4 my-12'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left Column - Content */}
          <div className='flex-1'>
            <div className='prose max-w-none'>
              <h1 className='text-3xl font-semibold mb-8'>
                {procedure.postTitle}
              </h1>
              <p className='text-lg text-gray-700 mb-8'>
                {procedure.postPara1}
              </p>

              {procedure.imageTwo && (
                <div className='relative w-full h-64 md:h-96 mb-8 lg:max-w-lg'>
                  <Image
                    src={procedure.imageTwo}
                    alt={`Secondary image for ${procedure.postTitle}`}
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              <p className='text-lg text-gray-700'>{procedure.postPara2}</p>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='md:w-1/3 flex flex-col gap-8'>
            <HomeJobForm />
            <RecentBlogPosts
              posts={proceduresData}
              title='Recent Procedures'
              maxPosts={4}
              basePath='/procedures'
            />
          </div>
        </div>
      </main>
    </section>
  );
};

export default SingleProcedurePage;
