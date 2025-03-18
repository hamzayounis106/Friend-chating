import mongoose, { Document, InferSchemaType, Schema } from 'mongoose';

export interface IOffer extends Document {
  jobId: mongoose.Types.ObjectId;
  cost: number;
  date: Date;
  location: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  description: string;
  status: 'pending' | 'accepted' | 'declined';
}

const offerSchema = new Schema<IOffer>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative'],
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set when the offer is created
    immutable: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
    required: true,
  },
});

export type LeanOffer = Omit<InferSchemaType<typeof offerSchema>, '_id'> & {
  _id: string;
};

export default mongoose.models.Offer ||
  mongoose.model<IOffer>('Offer', offerSchema);
