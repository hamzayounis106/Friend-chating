import mongoose, { Document, InferSchemaType, Schema } from 'mongoose';
import { IUser } from './User';

// Add job status enum
export enum JobStatus {
  CREATED = 'created',
  STARTED = 'started',
  CLOSED = 'closed',
}

export interface IJob extends Document {
  title: string;
  type: string;
  date: Date;
  description: string;
  surgeonEmails: {
    email: string;
    status: 'accepted' | 'declined' | 'pending';
  }[];
  AttachmentUrls?: string[];
  budget?: number;
  createdBy: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  status: JobStatus; // Add status field
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, minlength: 5, maxlength: 100 },
  type: { type: String, required: true, minlength: 1, maxlength: 50 },
  date: { type: Date, required: true },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  surgeonEmails: {
    type: [
      {
        email: { type: String, required: true },
        status: {
          type: String,
          enum: ['accepted', 'declined', 'pending'],
          required: true,
        },
      },
    ],
    required: true,
    _id: false, // Prevents Mongoose from adding _id to each object in the array
  },
  AttachmentUrls: { type: [String], default: undefined }, // ✅ Made optional
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    default: undefined,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.CREATED,
    required: true,
  },
});

export type LeanJob = Omit<
  InferSchemaType<typeof jobSchema>,
  '_id' | 'patientId'
> & {
  _id: string;
  patientId?: IUser; // ✅ Ensuring patientId is either a full User or undefined
};

export default mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);