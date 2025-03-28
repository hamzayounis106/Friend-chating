import ArticleGrid from '@/components/articles/ArticleGrid';
import articleData from '@/components/articles/ArticlesData';
import Image from 'next/image';
import Link from 'next/link';
import TopBarComp from '../TopBarComp';

const ArticlesPage = () => {
  return (
    <section>
      <TopBarComp title='Articles' />
      <main className='container mt-12'>
        {/* <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {articleData.map((article) => (
            <Link
              key={article?.id}
              href={`/articles/${article?.postSlug}`}
              className='bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
            >
              <div className='relative w-full h-56'>
                <Image
                  src={article?.featureImage}
                  alt={article?.postTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                  className='rounded-t-2xl'
                />
              </div>
              <div className='p-4'>
                <h2 className='text-xl font-semibold mb-2'>
                  {article?.postTitle}
                </h2>
                <p className='text-gray-600 text-sm'>{article?.postDate}</p>
                <p className='text-gray-700 mt-2 line-clamp-2'>
                  {article?.postPara1}
                </p>
              </div>
            </Link>
          ))}
        </div> */}
        <ArticleGrid />
      </main>
    </section>
  );
};

export default ArticlesPage;
