'use client';
import BlogCard from '@/app/(blogs)/BlogCard';
import SearchInput from '@/app/(blogs)/SearchInput';
import { useState, useMemo } from 'react';
import articleData from './ArticlesData';

const ArticleGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return articleData;

    return articleData.filter((article) => {
      console.log('comming article', article);
      const searchContent =
        `${article?.postTitle} ${article?.postPara1} `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <>
      <div className='mb-8'>
        <SearchInput
          placeholder='Search articles by title or content...'
          onSearch={setSearchTerm}
        />
      </div>

      <p className='text-sm text-gray-500 mb-4'>
        Showing {filteredArticles.length} of {articleData.length} articles
      </p>

      <div className='grid sm:grid-cols-2 gap-6'>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <BlogCard key={article.id} data={article} link={'articles'} />
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No articles found matching &quot;{searchTerm}&quot;
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleGrid;
