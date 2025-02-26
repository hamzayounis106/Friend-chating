import { mainClient, mailSender } from '@/lib/mail';
import { User } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

export async function sendVerificationEmail(user: any) {
  if (!user) {
    return Promise.reject(new Error(`User not found`));
  }

  if (user.isVerified) {
    return Promise.reject(new Error('EMAIL IS NOT VERIFIED'));
  }

  const verificationToken = uuidv4();
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
  const recipients = [{ email: user.email }];

  try {
    await mainClient.send({
      from: mailSender,
      to: recipients,
      subject: `Verify Your Email ${Date.now()}`,
      html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
      category: 'Email verification',
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
