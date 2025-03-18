import { getJobsByUserId } from '@/helpers/get-jobs-by-user-id';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { formatTimeAgo } from '@/lib/utils';

export default async function MyPosts() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const posts = await getJobsByUserId(userId as string);
  console.log('posts', posts);
  // Get status counts
  const totalPosts = posts?.length || 0;
  const pendingPosts =
    posts?.filter((job) =>
      job.surgeonEmails.some((surgeon) => surgeon.status === 'pending')
    ).length || 0;
  const acceptedPosts =
    posts?.filter((job) =>
      job.surgeonEmails.some((surgeon) => surgeon.status === 'accepted')
    ).length || 0;

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>My Posts</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Manage your cosmetic procedure requests
          </p>
        </div>
        <div className='mt-4 sm:mt-0'>
          <Link
            href='/dashboard/add'
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8'>
        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-500 rounded-md p-3'>
                <UsersIcon className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Posts
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900'>
                      {totalPosts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-yellow-500 rounded-md p-3'>
                <ClockIcon className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Pending Responses
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900'>
                      {pendingPosts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-green-500 rounded-md p-3'>
                <TagIcon className='h-6 w-6 text-white' />
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Accepted
                  </dt>
                  <dd>
                    <div className='text-lg font-medium text-gray-900'>
                      {acceptedPosts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=' shadow overflow-hidden sm:rounded-md'>
        <ul className=' flex flex-col gap-2'>
          {posts?.length === 0 ? (
            <li className='px-6 py-12'>
              <div className='text-center'>
                <UsersIcon className='mx-auto h-12 w-12 text-gray-300' />
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  No posts yet
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Get started by creating a new post.
                </p>
                <div className='mt-6'>
                  <Link
                    href='/dashboard/add'
                    className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
                  >
                    <PlusIcon
                      className='-ml-1 mr-2 h-5 w-5'
                      aria-hidden='true'
                    />
                    New Post
                  </Link>
                </div>
              </div>
            </li>
          ) : (
            posts?.map((job, index) => {
              // Calculate response stats
              const totalResponses = job.surgeonEmails.length;
              const acceptedResponses = job.surgeonEmails.filter(
                (s) => s.status === 'accepted'
              ).length;
              const pendingResponses = job.surgeonEmails.filter(
                (s) => s.status === 'pending'
              ).length;

              // Format date
              const timeAgo = formatTimeAgo(job?.createdAt || job?.date);

              return (
                <li key={job._id || index}>
                  <div className='bg-white px-4 py-4 sm:px-6 block hover:bg-gray-50 border'>
                    <div className='flex items-center justify-between'>
                      <div className='truncate'>
                        <div className='flex text-sm'>
                          <p className='font-medium text-blue-600 truncate'>
                            {acceptedResponses ? (
                              <Link href={`/job-post/${job._id}`}>
                                {job.title}
                              </Link>
                            ) : (
                              <span>Not Accpeted Yet</span>
                            )}
                          </p>
                          <p className='ml-1 flex-shrink-0 font-normal text-gray-500'>
                            {job.type && `• ${job.type}`}
                          </p>
                        </div>
                        <div className='mt-2'>
                          <div className='flex items-center text-sm text-gray-500'>
                            <CalendarIcon className='flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400' />
                            <p>Posted {timeAgo}</p>
                          </div>
                        </div>
                      </div>
                      <div className='ml-2 flex flex-col flex-shrink-0 items-end'>
                        <div className='flex space-x-2'>
                          {acceptedResponses > 0 && (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                              {acceptedResponses} Invite Accepted
                            </span>
                          )}
                          {pendingResponses > 0 && (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                              {pendingResponses} Invite Pending
                            </span>
                          )}
                        </div>
                        <div className='mt-2 flex items-center text-sm text-gray-500'>
                          <UsersIcon className='flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400' />
                          <p>
                            {totalResponses}{' '}
                            {totalResponses === 1 ? 'invited' : 'invited'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='mt-2 sm:flex sm:justify-between'>
                      <div className='sm:flex'>
                        <p className='mt-2 flex items-center text-sm text-gray-500 sm:mt-0'>
                          <TagIcon className='flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400' />
                          {job.status || 'Open'}
                        </p>
                      </div>
                    </div>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {job.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
