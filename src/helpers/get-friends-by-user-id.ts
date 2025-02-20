import FriendRequest from '@/app/models/FriendRequest';
import User, { IUser } from '@/app/models/User';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// Define Friend type that will be returned to the client
export interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string; // Optional
}

// Get friends of a user by their ID
export const getFriendsByUserId = async (userId: string): Promise<Friend[]> => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Find the user by ID and populate the 'friends' field
    const user = await User.findById(userId).populate('friends').lean<IUser>();

    if (!user) {
      throw new Error('User not found');
    }
    console.log('check the user friend', user);

    return user.friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

// Get the count of pending friend requests
export const getFriendRequestCount = async (
  userId: string
): Promise<number> => {
  console.log('User ID from getFriendRequestCount:', userId);
  try {
    await dbConnect();

    // Query for pending friend requests
    const count = await FriendRequest.countDocuments({
      receiver: new mongoose.Types.ObjectId(userId), // Ensure ID is converted to ObjectId
      status: 'pending',
    });
    return count;
  } catch (error) {
    console.error('Error fetching friend request count:', error);
    return 0;
  }
};
