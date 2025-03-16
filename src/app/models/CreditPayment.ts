// models/CreditPayment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditPayment extends Document {
  paymentIntentId: string;
  patientId: mongoose.Types.ObjectId;
  status: string;
  metadata: {
    type: string;
    credits?: number; // Optional for credits
    title?: string; // Optional for credits
    amount: number;
    offerId?: string; // Optional for offers
    jobId?: string; // Optional for offers
    location?: string; // Optional for offers
    expectedSurgeryDate?: string; // Optional for offers
  };
  createdAt: Date;
  updatedAt: Date;
}

const CreditPaymentSchema: Schema = new Schema(
  {
    paymentIntentId: { type: String, required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true },
    metadata: {
      type: { type: String, required: true },
      credits: { type: Number, required: false }, // Optional
      title: { type: String, required: false }, // Optional
      amount: { type: Number, required: true },
      offerId: { type: String, required: false }, // Optional
      jobId: { type: String, required: false }, // Optional
      location: { type: String, required: false }, // Optional
      expectedSurgeryDate: { type: String, required: false }, // Optional
    },
  },
  { timestamps: true }
);

export default mongoose.models.CreditPayment ||
  mongoose.model<ICreditPayment>('CreditPayment', CreditPaymentSchema);
