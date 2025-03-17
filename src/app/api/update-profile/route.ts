import { getServerSession } from 'next-auth';
import User from '@/app/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('session from server 👦🏽👦🏽👦🏽👦🏽👦🏽', session);
    console.log('body is comming from the frontend', body);
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { ...body },
      { new: true }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}
