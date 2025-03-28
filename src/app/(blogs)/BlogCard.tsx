import Image from 'next/image';
import Link from 'next/link';
import { BlogDataType } from './BlogTypes';

const BlogCard = ({ data, link }: { data: BlogDataType; link: string }) => {
  return (
    <Link
      href={`/${link}/${data?.postSlug}`}
      className='bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
    >
      <div className='relative w-full h-48 md:h-56 lg:h-64'>
        <Image
          src={data?.featureImage}
          alt={data?.postTitle || 'Blog Image'}
          fill
          className='object-cover rounded-t-2xl'
          priority
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className='p-4'>
        <h2 className='text-xl font-semibold mb-2'>{data?.postTitle}</h2>
        <p className='text-gray-600 text-sm'>{data?.postDate}</p>
        <p className='text-gray-700 mt-2 line-clamp-2'>{data?.postPara1}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
