import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    await dbConnect();

    const user = await User.findById(id).lean();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
