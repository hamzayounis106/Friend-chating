import articleData from '@/components/articles/ArticlesData';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

const RecentArticles = () => {
  const sortedPosts = [...articleData].sort((a, b) => {
    return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
  });

  // Get the most recent posts based on maxPosts
  const recentPosts = sortedPosts.slice(0, 4);

  return (
    <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
      <div className='flex items-center justify-between mb-6 pb-3 border-b border-gray-200'>
        <h3 className='text-xl font-bold text-gray-800'>
          Recent Articles
        </h3>
        <Link 
          href="/articles" 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors"
        >
          View all
          <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>

      <div className='space-y-6'>
        {recentPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`group ${index < recentPosts.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}
          >
            <Link href={`/articles/${post.postSlug}`} className='block'>
              <div className='flex gap-4 items-center'>
                <div className='w-1/3 flex-shrink-0 relative h-20 overflow-hidden rounded-xl'>
                  <Image
                    src={post.featureImage}
                    alt={post.postTitle}
                    width={120}
                    height={80}
                    className='object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className='w-2/3'>
                  <h4 className='font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2'>
                    {post.postTitle}
                  </h4>
                  <div className='flex items-center text-gray-500 text-xs mt-2'>
                    <Clock size={12} className='mr-1' />
                    <span>{post.postDate}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <Link 
          href="/articles" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Browse All Articles
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RecentArticles;