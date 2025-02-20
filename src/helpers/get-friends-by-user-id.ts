import FriendRequest from '@/app/models/FriendRequest';
import User, { IUser } from '@/app/models/User';
import { Friend } from '@/components/SidebarChatList';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

interface LeanUser extends Omit<IUser, 'friends'> {
  friends: Friend[];
}

export const getFriendsByUserId = async (userId: string): Promise<Friend[]> => {
  try {
    await dbConnect();

    const user = await User.findById(userId)
      .populate({
        path: 'friends',
        select: '_id name email image',
        options: { lean: true },
      })
      .lean<LeanUser | null>()
      .exec();

    if (!user || !user.friends) {
      return [];
    }

    const friends = user.friends.map((friend) => ({
      _id: friend?._id.toString(),
      name: friend.name,
      email: friend.email,
      image: friend.image,
    }));

    return friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

export const getFriendRequestCount = async (
  userId: string
): Promise<number> => {
  try {
    await dbConnect();

    // Query for pending friend requests
    const count = await FriendRequest.countDocuments({
      receiver: new mongoose.Types.ObjectId(userId),
      status: 'pending',
    });
    return count;
  } catch (error) {
    console.error('Error fetching friend request count:', error);
    return 0;
  }
};
