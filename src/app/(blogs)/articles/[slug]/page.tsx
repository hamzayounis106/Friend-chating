'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import articlesData from '@/components/articles/ArticlesData';

const SingleSlugPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const article = articlesData.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className='flex items-center justify-center h-screen text-2xl font-semibold text-gray-700'>
        Article Not Found 😢
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>{article.title}</h1>
      <p className='text-gray-500 text-center'>{article.date}</p>

      <div className='grid md:grid-cols-2 gap-4 mt-6'>
        {article?.images?.map((img, index) => (
          <div key={index} className='relative w-full h-64'>
            <Image
              src={img}
              alt={`Image ${index + 1} of ${article.title}`}
              layout='fill'
              objectFit='cover'
              className='rounded-lg shadow-md'
            />
          </div>
        ))}
      </div>

      <div className='mt-6 space-y-4'>
        {article.paragraphs.map((para, index) => (
          <p key={index} className='text-gray-700 text-lg'>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SingleSlugPage;
