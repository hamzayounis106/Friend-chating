import mongoose, { Document, Schema } from 'mongoose';

export interface ISurgery extends Document {
  patientId: mongoose.Types.ObjectId;
  surgeonId: mongoose.Types.ObjectId; 
  offerId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const surgerySchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
    },
    surgeonId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Surgeon ID is required'],
    },
    offerId: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'Offer ID is required'],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
surgerySchema.index({ patientId: 1, surgeonId: 1 });
surgerySchema.index({ offerId: 1 });
surgerySchema.index({ jobId: 1 });
surgerySchema.index({ status: 1 });

// Create virtual for populating references
surgerySchema.virtual('patient', {
  ref: 'User',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true,
});

surgerySchema.virtual('surgeon', {
  ref: 'User',
  localField: 'surgeonId',
  foreignField: '_id',
  justOne: true,
});

surgerySchema.virtual('offer', {
  ref: 'Offer',
  localField: 'offerId',
  foreignField: '_id',
  justOne: true,
});

surgerySchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtuals are included when converting to JSON/objects
surgerySchema.set('toJSON', { virtuals: true });
surgerySchema.set('toObject', { virtuals: true });

// Use mongoose.models to prevent OverwriteModelError when the function is called multiple times
const Surgery = mongoose.models.Surgery || mongoose.model<ISurgery>('Surgery', surgerySchema);

export default Surgery;