import User, { IUser } from '@/app/models/User';
import dbConnect from '@/lib/db'; // Import MongoDB connection

export const getFriendsByUserId = async (userId: string): Promise<IUser['friends']> => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await dbConnect();

    // Find the user by ID and populate the 'friends' field
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'name email',
      options: { strictPopulate: false }
    }).lean<IUser>();

    console.log('User:', user);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('User friends', user.friends);
    // Return the populated friends array
    return user.friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};