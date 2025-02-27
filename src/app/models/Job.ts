import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  type: string;
  date: Date;
  description: string;
  surgeonEmails: string[];
  videoURLs: string[];
  createdBy: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, minlength: 5, maxlength: 100 },
  type: { type: String, required: true, minlength: 1, maxlength: 50 },
  date: { type: Date, required: true },
  description: { type: String, required: true, minlength: 10, maxlength: 500 },
  surgeonEmails: { type: [String], required: true },
  videoURLs: { type: [String], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);