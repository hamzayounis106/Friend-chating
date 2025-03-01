import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';

export const getJobsForSurgeon = async (userEmail: string): Promise<JobData[]> => {
  try {
    await dbConnect();
    console.log('Database connected successfully');
    // console.log('userEmail:', userEmail);

    const jobs = await Job.find({
      "surgeonEmails.email": userEmail,
    })
      .select("title type date description surgeonEmails videoURLs createdBy patientId")
      .lean()
      .exec();

    if (jobs.length === 0) {
      return [];
    }

    return jobs.map((job) => ({
      _id: job._id?.toString(),
      title: job.title,
      type: job.type,
      date: job.date.toISOString(),      description: job.description,
      surgeonEmails: job.surgeonEmails.map(({ email, status }: { email: string; status: 'accepted' | 'declined' | 'pending' }) => ({
        email,
        status,
      })),
      videoURLs: job.videoURLs,
      createdBy: job.createdBy.toString(),
      patientId: job.patientId.toString(),
    })) as JobData[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};


export const getJobCountBySurgeon = async (
  userEmail: string
): Promise<number> => {
  try {
    await dbConnect();

    const count = await Job.countDocuments({
      "surgeonEmails.email": userEmail, 
    })
    // console.log('Job count for surgeon:', count);
    return count;
  } catch (error) {
    console.error('Error fetching job count:', error);
    return 0;
  }
};
