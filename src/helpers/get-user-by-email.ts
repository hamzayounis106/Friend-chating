import dbConnect from '@/lib/db';
import User, { IUser } from '@/app/models/User'; // Assuming you have a Mongoose User model

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    await dbConnect(); // Ensure Mongoose connects

    console.log('DB connected successfully');

    const user = await User.findOne({ email }).lean<IUser | null>().exec();

    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};
