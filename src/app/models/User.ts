import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  friends: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  }[];
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    emailVerified: Date,
    image: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema);
