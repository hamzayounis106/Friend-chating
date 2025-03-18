import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import JobDetail from '@/components/JobDetail';
import { getJobsForSurgeon } from '@/helpers/get-jobs-of-surgeon';
import { SurgeonEmail } from '@/types/surgeon';

export interface JobData {
  _id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  surgeonEmails: SurgeonEmail[];
  AttachmentUrls: string[];
  createdBy: string;
  status: string; // ✅ Add status field
  createdAt: Date;
  location: string[];
  patientId?: {
    // ✅ Made optional with `?`
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}

const Page = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const jobs: JobData[] = await getJobsForSurgeon(session.user.email as string);
  console.log('jobssssssssssssssssssssssssssssssssss', jobs);
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
