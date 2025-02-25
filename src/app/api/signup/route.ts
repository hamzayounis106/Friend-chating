import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { mailSender, mainClient } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';
// Define the expected schema for the signup request.
const signupSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['patient', 'surgeon']),
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { username, email, password, role } = signupSchema.parse(body);

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = uuidv4();
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role,
      friends: [],
      image: '',
      emailVerified: null,
      verificationToken,
    });

    await newUser.save();
    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    const recipients = [{ email }];
    try {
      const res = await mainClient.send({
        from: mailSender,
        to: recipients,
        subject: 'Verify Your email',
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
        category: 'Email verification',
      });
      console.log(
        'Response from sending verification email template to ' +
          email +
          ' is :' +
          res
      );
    } catch (error) {
      console.error('Error sending verification email template' + error);
    }

    return NextResponse.json(
      'User created. Please check your email to verify your account.',
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json('Invalid request payload', { status: 422 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}
