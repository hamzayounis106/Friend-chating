import FriendRequest from '@/app/models/Job';
import dbConnect from '@/lib/db';

export const getFriendRequests = async (userId: string) => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Find friend requests where the user is the receiver
    const friendRequests = await FriendRequest.find({
      receiver: userId.toString(),
    })
      .populate('sender', 'name email image')
      .lean();

    return friendRequests;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};
