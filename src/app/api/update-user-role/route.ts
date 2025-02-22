import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth'; // Import auth options
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { role } = await request.json();

    if (!role || !['patient', 'surgeon'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role provided' },
        { status: 400 }
      );
    }

    const token = await getToken({ req: request as any });
    if (!token || !token.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      token.id,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch the updated session
    const session = await getServerSession(authOptions);

    return NextResponse.json(
      { message: 'Role updated successfully', user: updatedUser, session },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error updating role' },
      { status: 500 }
    );
  }
}
