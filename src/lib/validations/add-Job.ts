import { z } from 'zod';

export const addJobValidator = z.object({
  // title: z.string().min(5).max(100),
  type: z.string().min(1).max(50),
  // location: z
  //   .string()
  //   .transform((val) => val.split(',').map((loc) => loc.trim()))
  //   .refine((locations) => locations.length > 0, {
  //     message: 'At least one location is required',
  //   }), //this is woking

  // location: z
  //   .string()
  //   .min(1, 'Preffered Location is required') // First ensure input is not empty
  //   .transform(
  //     (val) =>
  //       val
  //         .split(',')
  //         .map((loc) => loc.trim())
  //         .filter((loc) => loc !== '') // Remove empty strings after trimming
  //   )
  //   .refine((locations) => locations.length > 0, {
  //     message: 'At least one location is required',
  //   }),

  location: z
    .array(z.string().min(5))
    .min(1, { message: 'At least one location is required' })
    .refine(
      (location) =>
        new Set(location.map((singleLocation) => singleLocation)).size ===
        location.length,
      { message: 'Duplicate Locations are not allowed' }
    )
    .default([]),

  date: z
    .string()
    .transform((val) => new Date(val)) // Transform string to Date
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid date format',
    })
    .refine((date) => date >= new Date(), {
      message: 'Date must be in the future',
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description should be at least 10 characters long'),
  // surgeonEmails: z
  //   .string()
  //   .transform((val) =>
  //     val
  //       .split(',')
  //       .map((email) => email.trim())
  //       .filter((email) => email !== '')
  //       .map((email) => ({ email, status: 'pending' as const }))
  //   )
  //   .refine((emails) => emails.length > 0, {
  //     message: 'At least one surgeon email is required',
  //   })

  //   .refine(
  //     (emails) =>
  //       emails.every(
  //         (emailObj) => z.string().email().safeParse(emailObj.email).success
  //       ),
  //     {
  //       message: 'One or more emails are invalid',
  //     }
  //   )

  //   .refine(
  //     (emails) =>
  //       new Set(emails.map((emailObj) => emailObj.email)).size ===
  //       emails.length,
  //     {
  //       message: 'Duplicate emails are not allowed',
  //     }
  //   ),
  surgeonEmails: z
    .array(
      z.object({
        email: z.string().email('It should be an email '),
        status: z.literal('pending'),
      })
    )
    .min(1, { message: 'At least one surgeon email is required' })
    .refine(
      (emails) =>
        new Set(emails.map((emailObj) => emailObj.email)).size ===
        emails.length,
      { message: 'Duplicate emails are not allowed' }
    ),
  // videoURLs: z
  //   .string()
  //   .transform((val) =>
  //     val
  //       .split(',')
  //       .map((url) => url.trim())
  //       .filter((url) => url !== '')
  //   )
  //   .refine((urls) => urls.length > 0, {
  //     message: 'At least one URL is required',
  //   })
  //   .refine((urls) => urls.every((url) => url.startsWith('http')), {
  //     message: 'All URLs must be valid',
  //   }),
  AttachmentUrls: z.array(z.string().url()).optional(), // ✅ Make imageUrls optional
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions to proceed.',
  }),
  // budget: z
  //   .number()
  //   .min(0, 'Budget must be a positive number')
  //   .max(1000000, 'Budget cannot exceed 1,000,000')
  //   .optional(),
});
