import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import Job, { LeanJob } from '@/app/models/Job';
import JobDetailsOnChat from '@/components/JobDetailsOnChat';
import { IUser } from '@/app/models/User';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

const JobDetailPage = async ({ params }: PageProps) => {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const userRole = session.user.role; // ✅ Extracting userRole

  const [_, __, jobId] = chatId.split('--');
  const rawJob = await Job.findById(jobId)
    .populate<{ patientId: IUser }>('patientId') // ✅ Forces patientId to be an IUser
    .lean<LeanJob>();

  if (!rawJob) notFound();

  const relatedJob = {
    _id: rawJob._id?.toString(),
    title: rawJob.title,
    type: rawJob.type,
    date: new Date(rawJob.date).toISOString(),
    description: rawJob.description ?? '',
    surgeonEmails: rawJob.surgeonEmails.map((se) => ({
      email: se.email,
      status: se.status,
    })),
    createdBy: rawJob.createdBy.toString(),
    patientId: rawJob.patientId
      ? {
          _id: rawJob.patientId._id.toString(),
          name: rawJob.patientId.name,
          email: rawJob.patientId.email,
          image: rawJob.patientId.image as string,
        }
      : undefined,
    AttachmentUrls: rawJob.AttachmentUrls ?? [],
    status:rawJob.status
  };

  return (
    <div className='p-4'>
      {/* <h2 className='text-xl font-semibol  */}
      {/* <p>{relatedJob.description}</p> */}
      {/* ✅ Pass `userRole` to JobDetailsOnChat */}
      <JobDetailsOnChat job={relatedJob} userRole={userRole as string} />
    </div>
  );
};

export default JobDetailPage;
