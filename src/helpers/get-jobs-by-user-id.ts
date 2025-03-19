import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';
import { SurgeonEmail } from '@/types/surgeon';
import mongoose from 'mongoose';

export const getJobsByUserId = async (userId: string): Promise<JobData[]> => {
  try {
    await dbConnect();

    const jobs = await Job.find({
      patientId: new mongoose.Types.ObjectId(userId),
    })
      .select(
        '_id title type date description surgeonEmails videoURLs createdBy patientId status AttachmentUrls location'
      )
      .lean()
      .exec();

    return jobs.map((job) => ({
      _id: job._id?.toString(), // Include _id if needed in JobData
      title: job.title,
      type: job.type,
      date: job.date.toISOString(), // Convert Date to string
      description: job.description,
      surgeonEmails: job.surgeonEmails.map(
        ({ email, status }: SurgeonEmail) => ({
          email,
          status,
        })
      ),
      AttachmentUrls: job.AttachmentUrls,
      createdBy: job.createdBy.toString(),
      patientId: job.patientId.toString(),
      status: job.status,
      location: job.location,
    })) as JobData[]; // Explicit type assertion
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
