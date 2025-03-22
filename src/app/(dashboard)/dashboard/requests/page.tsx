import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import JobDetail from '@/components/JobDetail';
import { getJobsForSurgeon } from '@/helpers/get-jobs-of-surgeon';
import { JobData } from '@/components/jobs/job';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const Page = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const jobs: JobData[] = await getJobsForSurgeon(session.user.email as string);

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Assigned Jobs</h1>
      <div className='flex flex-col gap-4'>
        <Suspense fallback={<LoadingSpinner />}>
          <JobDetail jobs={jobs} userEmail={session.user.email as string} />
        </Suspense>
      </div>
    </main>
  );
};

export default Page;
