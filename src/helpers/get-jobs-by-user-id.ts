import { JobData } from '@/app/(dashboard)/dashboard/requests/page';
import Job from '@/app/models/Job';
import dbConnect from '@/lib/db';

import mongoose from 'mongoose';


export const getJobsByUserId = async (userId: string): Promise<JobData[]> => {
  try {
    await dbConnect();

    const jobs = await Job.find({ patientId: new mongoose.Types.ObjectId(userId) })
      .select('_id title type date description surgeonEmails videoURLs createdBy patientId')
      .lean()
      .exec();

    return jobs.map(job => ({
      // _id: job._id.toString(),
      title: job.title,
      type: job.type,
      date: job.date,
      description: job.description,
      surgeonEmails: job.surgeonEmails,
      videoURLs: job.videoURLs,
      createdBy: job.createdBy.toString(),
      patientId: job.patientId.toString(),
    })) as JobData[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobCountByUserId = async (userId: string): Promise<number> => {
  try {
    await dbConnect();

    // Query for jobs created by the user
    const count = await Job.countDocuments({
      patientId: new mongoose.Types.ObjectId(userId),
    });
    return count;
  } catch (error) {
    console.error('Error fetching job count:', error);
    return 0;
  }
};