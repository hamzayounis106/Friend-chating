import { z } from "zod";

export const addJobValidator = z.object({
  title: z.string().min(5).max(100),
  type: z.string().min(1).max(50),
  date: z
    .string()
    .transform((val) => new Date(val)) // Transform string to Date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date >= new Date(), {
      message: "Date must be in the future",
    }),
  description: z.string().min(10).max(500),
  surgeonEmails: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "")
        .map((email) => ({ email, status: "pending" as const }))
    )
    .refine((emails) => emails.length > 0, {
      message: "At least one surgeon email is required",
    })
    .refine(
      (emails) => new Set(emails.map((emailObj) => emailObj.email)).size === emails.length,
      {
        message: "Duplicate emails are not allowed",
      }
    ),
  videoURLs: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "")
    )
    .refine((urls) => urls.length > 0, {
      message: "At least one URL is required",
    })
    .refine((urls) => urls.every((url) => url.startsWith("http")), {
      message: "All URLs must be valid",
    }),
  agreeToTerms: z.boolean(),
});