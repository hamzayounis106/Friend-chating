import Job from '@/app/models/Job';
import { JobData } from '@/components/jobs/job';
import dbConnect from '@/lib/db';
import { SurgeonEmail } from '@/types/surgeon';

export const getJobsForSurgeon = async (
  userEmail: string
): Promise<JobData[]> => {
  try {
    await dbConnect();
    console.log('Database connected successfully');

    const jobs = await Job.find({
      'surgeonEmails.email': userEmail,
    })
      .select(
        'title type date description surgeonEmails videoURLs createdBy patientId AttachmentUrls status location createdAt'
      )
      .lean()
      .exec();

    if (jobs?.length === 0) {
      return [];
    }
    return jobs.map((job) => ({
      _id: job._id?.toString(),
      title: job.title,
      type: job.type,
      date: job.date.toISOString(),
      description: job.description,
      surgeonEmails: job.surgeonEmails.map(
        ({ email, status }: SurgeonEmail) => ({
          email,
          status,
        })
      ),
      AttachmentUrls: job.AttachmentUrls,
      location: job.location,
      createdBy: job.createdBy.toString(),
      patientId: job.patientId.toString(),
      createdAt: job?.createdAt?.toString(),
      status: job.status,
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
    return await Job.countDocuments({
      surgeonEmails: {
        $elemMatch: {
          email: userEmail,
          status: { $ne: 'accepted' },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching job count:', error);
    return 0;
  }
};
