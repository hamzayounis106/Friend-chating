import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // make sure to add this field for credentials login

  verificationToken: string;
  isVerified: boolean;
  image?: string;
  role: "patient" | "surgeon" | "pending";
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
    password: { type: String, required: false }, // new field for password
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    image: String,
    role: {
      type: String,
      enum: ["patient", "surgeon", "pending"],
      default: "pending",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
