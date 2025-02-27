import { z } from "zod";

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
    .string()
    .transform((val) => val.split(",").map((email) => email.trim()))
    .refine((emails) => emails.length > 0, {
      message: "At least one email is required",
    })
    .refine(
      (emails) =>
        emails.every((email) => z.string().email().safeParse(email).success),
      {
        message: "Invalid email format",
      }
    )
    .refine((emails) => new Set(emails).size === emails.length, {
      message: "Duplicate emails are not allowed",
    }),
    videoURLs: z
    .string()
    .transform((val) => val.split(",").map((url) => url.trim()))
    .refine((urls) => urls.length > 0, {
      message: "At least one URL is required",
    })
    .refine(
      (urls) => urls.every((url) => z.string().url().safeParse(url).success),
      {
        message: "Invalid URL format",
      }
    ),
  agreeToTerms: z.boolean(),
});
