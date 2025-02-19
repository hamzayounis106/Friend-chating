import mongoose from 'mongoose';
import User from './User';

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
});

friendRequestSchema.methods.accept = async function () {
  this.status = 'accepted';
  await this.save();

  // Add each user to the other's friends list
  await User.findByIdAndUpdate(this.sender, { $addToSet: { friends: this.receiver } });
  await User.findByIdAndUpdate(this.receiver, { $addToSet: { friends: this.sender } });
};

export default mongoose.models.FriendRequest || mongoose.model('FriendRequest', friendRequestSchema);