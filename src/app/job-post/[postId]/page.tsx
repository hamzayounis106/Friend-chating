import SingleJobPost from '@/components/SingleJobPost';
import { getSingleJobById } from '@/helpers/get-single-job-by-id';
import React from 'react';
export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const res = await getSingleJobById(postId);

  if (!res) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1 className='text-2xl font-bold text-red-500'>Job not found</h1>
      </div>
    );
  }

  // Serialize the data to prevent hydration errors
  const serializedJobData = JSON.parse(JSON.stringify(res));

  return (
    <div>
      <SingleJobPost jobData={serializedJobData} />
    </div>
  );
}
