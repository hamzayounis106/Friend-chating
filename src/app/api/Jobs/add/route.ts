import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import dbConnect from "@/lib/db"; // MongoDB connection
import User from "@/app/models/User";
import Job from "@/app/models/Job";
import { mailSender, mainClient } from "@/lib/mail";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse and transform the request body
    const body = await req.json();
    // console.log("Job Body---------------", body);

    // Validate the request body using Zod
    // Assuming you do Zod validation for other fields but skip for surgeonEmails and videoURLs
    // You can preprocess the email and video fields for proper format
    const { title, type, date, description, surgeonEmails, videoURLs, agreeToTerms, createdBy, patientId } = body;
// console.log('patientId', patientId);
    // Transform the 'surgeonEmails' array to just include email strings
    const validSurgeonEmails = [];
    for (const emailObj of surgeonEmails) {
      const user = await User.findOne({ email: emailObj.email });

      if (user) {
        if (user.role !== "patient") {
          validSurgeonEmails.push({ email: emailObj.email, status: emailObj.status });
        } else {
          // console.log(`Email: ${emailObj.email} is a Patient. Rejecting...`);
          return new Response(`Email: ${emailObj.email} is not of a surgeon.`, { status: 422 });
        }
      } else {
        // If the user doesn't exist in the database, still push the email
        validSurgeonEmails.push({ email: emailObj.email, status: emailObj.status });
      }
    }

    // Validate 'videoURLs' to make sure they are strings and not an array of objects.
    const validVideoURLs = Array.isArray(videoURLs) ? videoURLs : [];

    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create the new job post
    const job = new Job({
      title,
      type,
      date: new Date(date), // Ensure date is a Date object
      description,
      surgeonEmails: validSurgeonEmails, // Processed surgeonEmails
      videoURLs: validVideoURLs, // Processed video URLs
      createdBy: session.user.id,
      patientId,
    });

    await job.save();

    // Notify surgeons about the new job post
    for (const emailObj of validSurgeonEmails) {
      const surgeon = await User.findOne({ email: emailObj.email });

      if (surgeon) {
        // console.log(`Triggering Pusher event for surgeon: ${emailObj.email}`);
        await pusherServer.trigger(
          toPusherKey(`surgeon:${emailObj.email}:jobs`),
          "new_job",
          {
            _id: job._id,
            title,
            type,
            date: new Date(date).toISOString(),
            description,
            surgeonEmails: validSurgeonEmails,
            videoURLs: validVideoURLs,
            createdBy: session.user.email,
            patientId: session.user.id,
          }
        );
        // console.log("Pusher event triggered successfully");
      }

      const recipients = [{ email: emailObj.email }];
      // console.log("Sending email to---------------", emailObj.email);

      try {
        await mainClient.send({
          from: mailSender,
          to: recipients,
          subject: `New Job Post: ${title}`,
          html: `<p>A new job post has been created by ${session.user.name}</p>
                 <p>Job Details:</p>
                 <ul>
                   <li>Title: ${title}</li>
                   <li>Type: ${type}</li>
                   <li>Date: ${new Date(date).toISOString()}</li>
                   <li>Description: ${description}</li>
                 </ul>
                 <p>Please login to your account to view the job post.</p>`,
          category: "Job Notification",
        });
      } catch (error) {
        console.error("Error sending notification email:", error);
        throw new Error("Failed to send notification email");
      }
    }

    return new Response("Job post created successfully", { status: 201 });
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof z.ZodError) {
      return new Response(`Invalid request payload: ${error.message}`, { status: 422 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
