import articlesData from '@/components/articles/ArticlesData'; // Adjust path if needed
import Image from 'next/image';
import Link from 'next/link';

const ArticlesPage = () => {
  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Our Latest Articles
      </h1>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {articlesData.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className='bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
          >
            <div className='relative w-full h-56'>
              <Image
                src={article.images[0]} // Show the first image
                alt={article.title}
                layout='fill'
                objectFit='cover'
                className='rounded-t-2xl'
              />
            </div>
            <div className='p-4'>
              <h2 className='text-xl font-semibold mb-2'>{article.title}</h2>
              <p className='text-gray-600 text-sm'>{article.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
