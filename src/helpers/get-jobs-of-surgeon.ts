import Job from "@/app/models/Job";
import dbConnect from "@/lib/db";
import { JobData } from "@/types/job";

export const getJobsForSurgeon = async (
  userEmail: string
): Promise<JobData[]> => {
  try {
    await dbConnect();
    console.log("Database connected successfully");
console.log("userEmail:::::::::::::::::::::::::::::::::::::::::::::: ❌❌❌", userEmail);
    const jobs = await Job.find({ surgeonEmails: { $in: [userEmail] } })
      .select(
        "title type date description surgeonEmails videoURLs createdBy patientId"
      )
      .lean()
      .exec();
    if (jobs.length === 0) {
      return [];
    }
    console.log("jobs", jobs);

    return jobs.map((job) => ({
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
    console.error("Error fetching jobs:::::::::::::::::::::::::::::::::::::::::::", error);
    throw error;
  }
};

export const getJobCountBySurgeon = async (
  userEmail: string
): Promise<number> => {
  try {
    await dbConnect();

    // Query for jobs created by the user
    // const count = await Job.countDocuments({
    //   patientId: new mongoose.Types.ObjectId(userEmail),
    // });
    const count = await Job.countDocuments({
      surgeonEmails: { $in: [userEmail] },
    });
 
    console.log("count", count);
    return count;
  } catch (error) {
    console.error("Error fetching job count:", error);
    return 0;
  }
};
