import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';

export const getSingleJobById = async (
  jobId: string
): Promise<JobData | null> => {
  try {
    await dbConnect();
    const jobIdConverted = jobId.toString();

    const job = await Job.findById(jobIdConverted).populate('patientId').exec();

    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};
