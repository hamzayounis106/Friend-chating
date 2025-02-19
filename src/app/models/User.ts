import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  accounts: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  emailVerified: Date,
  image: String,
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
}, {
  timestamps: true
});

console.log('User schema:', userSchema);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);