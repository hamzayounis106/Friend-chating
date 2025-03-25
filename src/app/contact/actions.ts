'use server';

import { ContactFormSchema } from '@/lib/validations/contact';
import { mainClient, mailSender } from '@/lib/mail';

export async function submitContactForm(data: unknown) {
  // Validate with Zod
  const result = ContactFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.format() };
  }
  const emailOfAdmin = process.env.MAIL_TRAP_ADMIN_EMAIL!;
  const subjectWithTimestamp = `${
    result.data.subject
  } - ${new Date().toLocaleString()}`;
  try {
    await mainClient.send({
      from: mailSender,
      to: [{ email: emailOfAdmin }],
      subject: subjectWithTimestamp,
      text: result.data.message,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${result.data.name}</p>
        <p><strong>Email:</strong> ${result.data.email}</p>
        <p><strong>Subject:</strong> ${result.data.subject}</p>
        <p><strong>Message:</strong> ${result.data.message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}
