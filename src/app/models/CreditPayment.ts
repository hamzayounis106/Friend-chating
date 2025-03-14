// models/CreditPayment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditPayment extends Document {
  paymentIntentId: string;
  patientId: mongoose.Types.ObjectId;
  status: string;
  metadata: {
    type: string;
    credits: number;
    title: string;
    amount: number;
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
      type: { type: String },
      credits: { type: Number },
      title: { type: String },
      amount: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.CreditPayment ||
  mongoose.model<ICreditPayment>('CreditPayment', CreditPaymentSchema);
