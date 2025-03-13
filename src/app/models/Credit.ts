import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CreditDocument extends Document {
  surgeonId: mongoose.Types.ObjectId[] | null; // Array of IDs, nullable
  patientId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CreditSchema = new Schema<CreditDocument>(
  {
    surgeonId: {
      type: [Schema.Types.ObjectId], // Array of ObjectIds
      ref: 'User',
      default: null, // Default to null
      required: false, // Not required
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: false,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create compound indexes for common query patterns
CreditSchema.index({ 'surgeonId.0': 1, isUsed: 1 }); // Efficient array indexing
CreditSchema.index({ patientId: 1, isUsed: 1 });

// Static method to count unused credits for a surgeon
CreditSchema.statics.getUnusedCreditsCount = async function (
  surgeonId: string
) {
  return this.countDocuments({
    surgeonId: new mongoose.Types.ObjectId(surgeonId),
    isUsed: false,
  });
};

// Static method to get all unused credits for a surgeon
CreditSchema.statics.getUnusedCredits = async function (surgeonId: string) {
  return this.find({
    surgeonId: new mongoose.Types.ObjectId(surgeonId),
    isUsed: false,
  }).populate('jobId');
};

// Static method to mark credit as used
CreditSchema.statics.markAsUsed = async function (creditId: string) {
  return this.findByIdAndUpdate(creditId, { isUsed: true }, { new: true });
};

const Credit: Model<CreditDocument> =
  mongoose.models.Credit ||
  mongoose.model<CreditDocument>('Credit', CreditSchema);

export default Credit;
