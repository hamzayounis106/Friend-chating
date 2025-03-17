import mongoose, { Document, InferSchemaType, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verificationToken: string;
  isVerified: boolean;
  image?: string;
  role: 'patient' | 'surgeon' | 'pending';
  friends: mongoose.Types.ObjectId[];
  resetToken?: string;
  resetTokenExpiry?: number;
  creditIds: mongoose.Types.ObjectId[];
  phone?: string;
  city?: string;
  country?: string;
  description?: string;
  address?: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    image: String,
    role: {
      type: String,
      enum: ['patient', 'surgeon', 'pending'],
      default: 'pending',
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    resetToken: { type: String },
    creditIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credit',
        required: false,
        default: [],
      },
    ],
    resetTokenExpiry: { type: Number },
    phone: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    description: { type: String, required: false },
    address: { type: String, required: false },
  },

  {
    timestamps: true,
  }
);

export type LeanUser = Omit<InferSchemaType<typeof userSchema>, '_id'> & {
  _id: string;
}; // ✅ Override _id as string
export default mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema);
