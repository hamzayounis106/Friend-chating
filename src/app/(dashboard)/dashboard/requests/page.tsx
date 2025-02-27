import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import JobDetail, { Job } from '@/components/JobDetail';
import { getJobsForSurgeon } from '@/helpers/get-jobs-of-surgeon';

const Page = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  interface Job {
    title: string;
    type: string;
    date: string; // Ensure this is a string
    description: string;
    surgeonEmails: string[];
    videoURLs: string[];
    createdBy: string;
    patientId: string;
  }

  const jobs: Job[] = (
    await getJobsForSurgeon(session.user.email as string)
  ).map((job) => ({
    ...job,
    date: job.date.toISOString(),
  }));

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Assigned Jobs</h1>
      <div className='flex flex-col gap-4'>
        <JobDetail jobs={jobs} userEmail={session.user.email as string} />
      </div>
    </main>
  );
};

export default Page;
