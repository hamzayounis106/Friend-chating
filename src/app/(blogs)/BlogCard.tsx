import Image from 'next/image';
import Link from 'next/link';
import { BlogDataType } from './BlogTypes';
import { Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ data, link }: { data: BlogDataType; link: string }) => {
  return (
    <Link
      href={`/${link}/${data?.postSlug}`}
      className='group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300'
    >
      <div className='relative w-full h-52 md:h-60 lg:h-64 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity' />
        
        <Image
          src={data?.featureImage}
          alt={data?.postTitle || 'Blog Image'}
          fill
          className='object-cover transform group-hover:scale-105 transition-transform duration-500'
          priority
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        
        {/* {data?.category && (
          <span className='absolute top-4 left-4 z-20 bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded'>
            {data.category}
          </span>
        )} */}
      </div>

      <div className='flex flex-col flex-grow p-5'>
        <div className='flex items-center text-gray-500 text-xs mb-3'>
          <Clock size={14} className='mr-1' />
          <span>{data?.postDate}</span>
        </div>
        
        <h2 className='text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200'>
          {data?.postTitle}
        </h2>
        
        <p className='text-gray-600 text-sm line-clamp-3 mb-4 flex-grow'>
          {data?.postPara1}
        </p>
        
        <div className='flex items-center text-blue-600 text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform duration-200'>
          Read More 
          <ArrowRight size={16} className='ml-1 group-hover:ml-2 transition-all duration-200' />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;