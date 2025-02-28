import { z } from "zod";

// Your schema definition
export const addJobValidator = z.object({
  title: z.string().min(5).max(100),
  type: z.string().min(1).max(50),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "Date must be in the future",
    }),
  description: z.string().min(10).max(500),
  surgeonEmails: z
    .array(
      z.object({
        email: z.string().email(),
        status: z.literal("pending"),
      })
    )
    .min(1, { message: "At least one surgeon email is required" })
    .refine(
      (emails) => new Set(emails.map((emailObj) => emailObj.email)).size === emails.length,
      {
        message: "Duplicate emails are not allowed",
      }
    ),
  videoURLs: z
    .array(z.string().url())
    .min(1, { message: "At least one URL is required" }),
  agreeToTerms: z.boolean(),
  createdBy: z.string(),
  patientId: z.string(),
});

// Job body to validate
const jobBody = {
  title: 'new job',
  type: 'new job',
  date: '2025-03-07T00:00:00.000Z',
  description: 'new job new job',
  surgeonEmails: [
    { email: 'hamzayounis106@gmail.com', status: 'pending' },
    { email: 'ahmadeveloper077@gmail.com', status: 'pending' },
    { email: 'f22bdocs1m01248@iub.edu.pk', status: 'pending' }
  ],
  videoURLs: ['http://localhost:3000/dashboard/add.mp4'],
  agreeToTerms: true,
  createdBy: '64f92e65b6a8b3d5c6e98a42',
  patientId: '64f92e65b6a8b3d5c6e98b33'
};

// Validate the job body
try {
  const parsedJob = addJobValidator.parse(jobBody);
  console.log("Validation successful:", parsedJob);

  // Proceed with your logic (e.g., save the job to the database)
  // saveJobToDatabase(parsedJob);

} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Validation failed:", error.errors);
    // Handle the error (e.g., return an error response to the user)
    // return { success: false, errors: error.errors };
  } else {
    console.error("Unexpected error:", error);
    // Handle unexpected errors
    // return { success: false, message: "An unexpected error occurred" };
  }
}