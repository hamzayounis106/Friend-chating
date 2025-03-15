import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';


export const getSingleJobById = async (
  jobId: string
): Promise<JobData | null> => {
  try {
    await dbConnect();
    console.log('db-------------------------------------------------');
    const jobIdConverted = jobId.toString();
    console.log(
      'jobIdConverted-------------------------------------------------',
      jobIdConverted
    );
    const job = await Job.findById(jobIdConverted).populate('patientId').exec();

    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};
