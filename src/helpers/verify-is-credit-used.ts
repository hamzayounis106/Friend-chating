import dbConnect from "@/lib/db";
import User, { IUser } from "@/app/models/User";
import Credit from "@/app/models/Credit";
import Job, { LeanJob } from "@/app/models/Job";
import mongoose from "mongoose";

export const verifyIsCreditUsed = async (
  jobId: string,
  surgeonIdIncoming: string
): Promise<boolean> => {
  try {
    await dbConnect(); // Ensure Mongoose connects

    console.log(
      "DB connected successfully--------------------in get user by email"
    );

    const job = await Job.findById(jobId).lean<LeanJob | null>().exec();
    const surgeon = await User.findById(surgeonIdIncoming).lean<IUser | null>().exec();
    const patient = await User.findById(job?.patientId).lean<IUser | null>().exec();

    if (!job) {
      console.error("No job found for this ID");
      return false;
    }
    if (!surgeon) {
      console.error("No surgeon found for this ID");
      return false;
    }
    if (!patient) {
      console.error("No patient found for this job");
      return false;
    }

    // Check if there's a credit that's used for this job and surgeon

    // /abhi k liye just job or patient se check kerwa lete hn 

      const checkIfAnyCreditAlreadyUsed = await Credit.findOne({
      jobId: new mongoose.Types.ObjectId(jobId),
      isUsed: true,
    
    }).exec();

    // const checkIfAnyCreditAlreadyUsed = await Credit.findOne({
    //   jobId: new mongoose.Types.ObjectId(jobId),
    //   isUsed: true,
    //   surgeonId: { $elemMatch: { $eq: new mongoose.Types.ObjectId(surgeonIdIncoming) } }
    // }).exec();

    // If a credit exists, it means the surgeon has already used a credit for this job
    if (checkIfAnyCreditAlreadyUsed) {
      console.log("Credit already used for this job by this surgeon");
      return true;
    }

    console.log("No credit found for this job in use by this surgeon");
    return false;
  } catch (error) {
    console.error("Error verifying credit usage:", error);
    return false;
  }
};