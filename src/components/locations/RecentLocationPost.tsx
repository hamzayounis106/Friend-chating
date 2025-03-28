import Image from 'next/image';
import Link from 'next/link';
import locationData from './LocationData';

const RecentLocationPost = () => {
  // Sort posts by date (newest first)
  const sortedPosts = [...locationData].sort((a, b) => {
    return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
  });

  // Get the 3 most recent posts
  const recentPosts = sortedPosts.slice(0, 4);

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border'>
      <h3 className='text-xl font-semibold text-center mb-6 pb-2 border-b border-gray-200'>
        Recent Posts
      </h3>

      <div className='space-y-6'>
        {recentPosts.map((post) => (
          <div key={post.id} className='group'>
            <Link href={`/locations/${post.postSlug}`} className='block'>
              <div className='flex gap-4'>
                <div className='w-1/3 flex-shrink-0'>
                  <Image
                    src={post.featureImage}
                    alt={post.postTitle}
                    width={120}
                    height={80}
                    className='rounded-lg object-cover h-full'
                  />
                </div>
                <div className='w-2/3'>
                  <h4 className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors'>
                    {post.postTitle}
                  </h4>
                  <p className='text-sm text-gray-500 mt-1'>{post.postDate}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentLocationPost;
