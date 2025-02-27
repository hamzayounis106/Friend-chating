import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addJobValidator } from "@/lib/validations/add-Job";
import dbConnect from "@/lib/db"; // Import MongoDB connection
import User from "@/app/models/User";
// import Job from "@/app/models/Job"; // Import Job model
import { mailSender, mainClient } from "@/lib/mail";
import Job from "@/app/models/Job";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse and transform the request body
    const body = await req.json();
    console.log("Job Body---------------", body);
    // Filter surgeonEmails to include only users with the role of "surgeon"
    const validSurgeonEmails = [];
    for (const email of body.surgeonEmails) {
      const user = await User.findOne({ email });
      if (user) {
        if (user.role != "patient") {
          console.log("Email: " + email + "is of a surgeon.");
          validSurgeonEmails.push(email);
        } else {
          console.log("Email: " + email + "is of a Patient.");
          return new Response("Email: " + email + "is not of a surgeon.", {
            status: 422,
          });
        }
      } else {
        console.log("Email: " + email + "is not found.");
        validSurgeonEmails.push(email);
      }
    }

    // Transform arrays to strings for validation
    const transformedBody = {
      ...body,
      surgeonEmails: validSurgeonEmails.join(","),
      videoURLs: body.videoURLs.join(","),
    };

    const validatedData = addJobValidator.parse(transformedBody);

    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a new job post
    const job = new Job({
      title: validatedData.title,
      type: validatedData.type,
      date: validatedData.date,
      description: validatedData.description,
      surgeonEmails: validatedData.surgeonEmails,
      videoURLs: validatedData.videoURLs,
      createdBy: session.user.id,
      patientId: session.user.id,
    });

    await job.save();

    // Notify surgeons about the new job post
    for (const email of validSurgeonEmails) {
      const surgeon = await User.findOne({ email });
      if (surgeon) {
        await pusherServer.trigger(
          toPusherKey(`user:${surgeon._id.toString()}:new_job_post`),
          "new_job_post",
          {
            jobId: "job_id_placeholder", // Replace with actual job ID if using Job model
            jobTitle: validatedData.title,
            createdBy: session.user.email,
          }
        );
      }
      const recipients = [{ email }];
      console.log("Sending email to---------------", email);
      console.log("recipients---------------", recipients);
      try {
        await mainClient.send({
          from: mailSender,
          to: recipients,
          subject: `New Job Post: ${validatedData.title}`,
          html: `<p>A new job post has been created by ${session.user.name}</p>
                 <p>Job Details:</p>
                 <ul>
                   <li>Title: ${validatedData.title}</li>
                   <li>Type: ${validatedData.type}</li>
                   <li>Date: ${new Date(validatedData.date).toISOString()}</li>
                   <li>Description: ${validatedData.description}</li>
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
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
