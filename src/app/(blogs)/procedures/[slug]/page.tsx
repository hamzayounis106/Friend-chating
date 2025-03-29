// 'use client';
// import { useParams } from 'next/navigation';
// import Image from 'next/image';
// import proceduresData from '@/components/procedures/proceduresData';
// import HomeJobForm from '@/components/home/HomeJobForm';
// import RecentBlogPosts from '../../RecentPost';
// import RecentArticles from '../../RecentPost';

// const SingleProcedurePage = () => {
//   const params = useParams();
//   const slug = params?.slug;
//   const procedure = proceduresData.find((item) => item.postSlug === slug);

//   if (!procedure) {
//     return (
//       <div className='flex items-center justify-center h-screen text-2xl font-semibold text-gray-700'>
//         Procedure Not Found 😢
//       </div>
//     );
//   }

//   return (
//     <section>
//       {/* Hero Section */}
//       <div className='relative w-full min-h-[30vh]'>
//         <div
//           className='absolute inset-0 z-0'
//           style={{
//             backgroundImage: `url(${procedure.featureImage})`,
//             backgroundSize: 'cover',
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: '10px -305px',
//           }}
//         >
//           {/* <Image
//             src={procedure.featureImage}
//             alt={procedure.postTitle}
//             fill
//             className='object-cover'
//             priority
//             quality={100}
//             sizes='100vw'
//             placeholder='blur'
//             blurDataURL='data:image/svg+xml;base64'
//           /> */}
//           <div className='absolute inset-0 bg-primary opacity-40' />
//         </div>

//         <div className='relative w-full min-h-[30vh]'>
//           <div className='absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 text-white'>
//             {/* <p className='text-2xl sm:text-3xl font-medium'>Category</p> */}
//             <h1 className='text-3xl font-semibold sm:text-5xl'>Procedures</h1>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className='container mx-auto px-4 my-12'>
//         <div className='flex flex-col md:flex-row gap-8'>
//           {/* Left Column - Content */}
//           <div className='flex-1'>
//             <div className='prose max-w-none'>
//               <h1 className='text-3xl font-semibold mb-8'>
//                 {procedure.postTitle}
//               </h1>
//               <p className='text-lg text-gray-700 mb-8'>
//                 {procedure.postPara1}
//               </p>

//               {procedure.imageTwo && (
//                 <div className='relative w-full h-64 md:h-96 mb-8 lg:max-w-lg'>
//                   <Image
//                     src={procedure.imageTwo}
//                     alt={`Secondary image for ${procedure.postTitle}`}
//                     fill
//                     className='object-cover'
//                   />
//                 </div>
//               )}

//               <p className='text-lg text-gray-700'>{procedure.postPara2}</p>
//             </div>
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className='md:w-1/3 flex flex-col gap-8'>
//             <HomeJobForm />
//             <RecentArticles />
//           </div>
//         </div>
//       </main>
//     </section>
//   );
// };

// export default SingleProcedurePage;

'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';

import HomeJobForm from '@/components/home/HomeJobForm';
import RecentArticles from '../../RecentPost';
import proceduresData from '@/components/procedures/proceduresData';

const SingleProcedurePage = () => {
  const params = useParams();
  const slug = params?.slug;
  const procedure = proceduresData.find((item) => item.postSlug === slug);

  if (!procedure) {
    return (
      <div className='flex flex-col items-center justify-center h-[60vh] py-20'>
        <div className='text-center space-y-4 max-w-md mx-auto px-4'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Procedure Not Found
          </h1>
          <p className='text-gray-600'>
            We couldnt find the procedures you were looking for.
          </p>
          <Link
            href='/procedures'
            className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to all Procedures
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className='flex flex-col items-center'>
      {/* Hero Banner */}
      {/* <div className='relative w-full h-[40vh] md:h-[50vh] overflow-hidden'>
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `url(${procedure.featureImage})`,
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
              <span>Procedures</span>
            </div>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              {procedure.postTitle}
            </h1>
            <div className='flex items-center text-sm space-x-4 text-white/80'>
          
            </div>
          </div>
        </div>
      </div> */}
{/* Simple Blue Header */}
<div className='w-full bg-[#66ccff] py-10 sm:py-12'>
  <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='text-center'>
      <div className='flex items-center justify-center text-sm mb-2 text-white/80'>
        <MapPin className='w-4 h-4 mr-1' />
        <span>Articles</span>
      </div>
      <h1 className='text-3xl md:text-4xl font-bold text-white'>
        {procedure.postTitle}
      </h1>
      {procedure.postDate && (
        <div className='mt-3 text-sm text-white/80'>
          <Calendar className="w-4 h-4 mr-1 inline-block" />
          <span>{procedure.postDate}</span>
        </div>
      )}
    </div>
  </div>
</div>
      {/* Breadcrumb */}
      <div className='w-full bg-gray-50 border-b border-gray-100'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <nav className='flex text-sm text-gray-500'>
            <Link href='/' className='hover:text-gray-900'>
              Home
            </Link>
            <span className='mx-2'>/</span>
            <Link href='/procedures' className='hover:text-gray-900'>
              Procedures
            </Link>
            <span className='mx-2'>/</span>
            <span className='text-gray-900'>{procedure.postTitle}</span>
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
                {procedure.postPara1}
              </p>

              {/* Featured image with caption */}
              {procedure.imageTwo && (
                <figure className='my-8'>
                  <div className='relative w-full h-64 md:h-96 rounded-lg overflow-hidden'>
                    <Image
                      src={procedure.imageTwo}
                      alt={`Image of ${procedure.postTitle}`}
                      fill
                      className='object-cover'
                      priority
                    />
                  </div>
                  <figcaption className='text-center text-sm text-gray-500 mt-2'>
                    ${procedure.postTitle}
                  </figcaption>
                </figure>
              )}
              {/* Content blocks */}
              {procedure.content.map((block, index) => (
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
                    Looking for a surgeon ?
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

export default SingleProcedurePage;
