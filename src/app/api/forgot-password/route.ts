import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import crypto from 'crypto';
import { mainClient, mailSender } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    // Always send a generic response to avoid leaking user info
    const genericMessage = {
      message: 'The Forgot Passowrd link has been sent to the given email',
    };
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    try {
      const user = await User.findOne({ email });
      // console.log('user checking ', user);
      if (!user) {
        return NextResponse.json(genericMessage);
      }
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;

      await user.save();
    } catch (error) {
      console.error('Error updating user:', error);
    }

    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }/change-password?token=${resetToken}`;

    // Send reset email using MailtrapClient
    const recipients = [{ email }];
    try {
      await mainClient.send({
        from: mailSender,
        to: recipients,
        subject: 'Reset your password',
        text: `Please click the link to reset your password: ${resetUrl}`,
        html: `<p>Please click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Optionally, you could return an error response here.
    }

    return NextResponse.json(genericMessage);
  } catch (error) {
    console.log('error in forget password', error);
  }
}
