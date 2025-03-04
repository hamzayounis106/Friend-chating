import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { LeanUser } from '@/app/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();
    const user: LeanUser | null = await User.findOne({ email })
      .lean<LeanUser>()
      .exec();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { userId: user?._id?.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
