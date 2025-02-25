import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: 'Token is required' },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error verifying email:', error);
    return NextResponse.json(
      { message: 'Error verifying email' },
      { status: 500 }
    );
  }
}