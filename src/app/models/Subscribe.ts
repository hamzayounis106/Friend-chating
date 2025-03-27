import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscribe extends Document {
  email: string;
  createdAt: Date;
}

const subscribeSchema = new Schema<ISubscribe>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Subscribe ||
  mongoose.model<ISubscribe>('Subscribe', subscribeSchema);
