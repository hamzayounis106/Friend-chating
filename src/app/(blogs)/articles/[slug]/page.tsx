'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import articleData from '@/components/articles/ArticlesData';

const SingleSlugPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const article = articleData.find((item) => item.postSlug === slug);

  if (!article) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl font-semibold text-gray-700'>
        Article Not Found 😢
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        {article.postTitle}
      </h1>
      <p className='text-gray-500 text-center'>{article.postDate}</p>

      <div className='grid md:grid-cols-2 gap-4 mt-6'>
        {/* First image */}
        <div className='relative w-full h-64'>
          <Image
            src={article.featureImage}
            alt={`Feature image for ${article.postTitle}`}
            fill
            style={{ objectFit: 'cover' }}
            className='rounded-lg shadow-md'
          />
        </div>

        {/* Second image if exists */}
        {article.imageTwo && (
          <div className='relative w-full h-64'>
            <Image
              src={article.imageTwo}
              alt={`Secondary image for ${article.postTitle}`}
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-lg shadow-md'
            />
          </div>
        )}
      </div>

      <div className='mt-6 space-y-4'>
        <p className='text-gray-700 text-lg'>{article.postPara1}</p>
        <p className='text-gray-700 text-lg'>{article.postPara2}</p>
      </div>
    </div>
  );
};

export default SingleSlugPage;
