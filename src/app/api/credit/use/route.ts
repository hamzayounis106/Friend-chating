// import { NextRequest, NextResponse } from "next/server";

// import Credit from "@/app/models/Credit";
// import User from "@/app/models/User";
// import Job from "@/app/models/Job";
// import { getServerSession } from "next-auth";

// import mongoose from "mongoose";
// import dbConnect from "@/lib/db";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const { creditId, surgeonId } = await req.json();
    
//     // Validate required fields
//     if (!creditId) {
//       return NextResponse.json(
//         { error: "Credit ID is required" },
//         { status: 400 }
//       );
//     }

//     if (!surgeonId) {
//       return NextResponse.json(
//         { error: "Surgeon ID is required" },
//         { status: 400 }
//       );
//     }
    
//     // Connect to database
//     await dbConnect();
    
//     // Find credit and check if it's already used
//     const credit = await Credit.findById(creditId);
    
//     if (!credit) {
//       return NextResponse.json(
//         { error: "Credit not found" },
//         { status: 404 }
//       );
//     }
    
//     if (credit.isUsed) {
//       return NextResponse.json(
//         { error: "Credit has already been used" },
//         { status: 400 }
//       );
//     }

//     // Verify surgeon exists
//     const surgeon = await User.findById(surgeonId);
//     if (!surgeon || surgeon.role !== 'surgeon') {
//       return NextResponse.json(
//         { error: "Invalid surgeon ID" },
//         { status: 400 }
//       );
//     }

//     // Get job and patient info
//     const job = await Job.findById(credit.jobId);
//     const patient = await User.findById(credit.patientId);

//     if (!job || !patient) {
//       return NextResponse.json(
//         { error: "Associated job or patient not found" },
//         { status: 400 }
//       );
//     }

//     // Start a session for transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Update credit to mark as used and add surgeon
//       await Credit.findByIdAndUpdate(
//         creditId,
//         { 
//           isUsed: true,
//           surgeonId: new mongoose.Types.ObjectId(surgeonId)
//         },
//         { session }
//       );

//       // Add credit to patient's creditIds array
//       await User.findByIdAndUpdate(
//         credit.patientId,
//         { $addToSet: { creditIds: creditId } },
//         { session }
//       );

//       // Add credit to surgeon's creditIds array
//       await User.findByIdAndUpdate(
//         surgeonId,
//         { $addToSet: { creditIds: creditId } },
//         { session }
//       );

//       // Add credit to job's creditIds array
//       await Job.findByIdAndUpdate(
//         credit.jobId,
//         { $addToSet: { creditIds: creditId } },
//         { session }
//       );

//       await session.commitTransaction();
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: "Credit used successfully",
//       credit: await Credit.findById(creditId)
//     });
    
//   } catch (error: any) {
//     console.error("Error using credit:", error);
//     return NextResponse.json(
//       { error: "Failed to use credit: " + error.message },
//       { status: 500 }
//     );
//   }
// }`
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/app/models/User";
import Job from "@/app/models/Job";
import Credit from "@/app/models/Credit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const { jobId, surgeonId } = await req.json();
    
    if (!jobId || !surgeonId) {
      return NextResponse.json(
        { error: "Job ID and surgeon ID are required" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get patient's unused credits
    const credits = await Credit.find({
      patientId: new mongoose.Types.ObjectId(session.user.id),
      isUsed: false
    });
    
    if (!credits || credits.length === 0) {
      return NextResponse.json(
        { error: "No unused credits found" },
        { status: 400 }
      );
    }
    
    const credit = credits[0]; // Use the oldest credit
    
    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }
    
    // Mark credit as used
    const updatedCredit = await Credit.findByIdAndUpdate(
      credit._id,
      { 
        isUsed: true,
        jobId: new mongoose.Types.ObjectId(jobId),
        surgeonId: [new mongoose.Types.ObjectId(surgeonId)]
      },
      { new: true }
    );
    
    // Update surgeons with credit ID
    if (job.surgeonEmails && job.surgeonEmails.length > 0) {
      await User.updateMany(
        { email: { $in: job.surgeonEmails.map(s => s.email) } },
        { $push: { creditIds: credit._id } }
      );
    }
    
    // Update job with credit ID
    await Job.findByIdAndUpdate(
      jobId,
      { $push: { creditIds: credit._id } }
    );
    
    // Update patient user record
    await User.findByIdAndUpdate(
      session.user.id,
      { $push: { usedCreditIds: credit._id } }
    );
    
    return NextResponse.json({
      success: true,
      message: "Credit used successfully",
      credit: updatedCredit
    });
    
  } catch (error: any) {
    console.error("Error using credit:", error);
    return NextResponse.json(
      { error: error.message || "Failed to use credit" },
      { status: 500 }
    );
  }
}