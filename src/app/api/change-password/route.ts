// src/app/api/change-password/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import { hashPassword } from '@/lib/verifyPassword';

export async function POST(req: Request) {
  await dbConnect();
  const { token, newPassword } = await req.json();

  // Find user by reset token and ensure the token hasn't expired
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  // console.log('user from reset password ', user);

  if (!user) {
    return NextResponse.json(
      { error: 'Token is invalid or has expired.' },
      { status: 400 }
    );
  }

  // Hash the new password and update the user document
  user.password = await hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: 'Password updated successfully.' });
}
