import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the Notification document
export interface INotification extends Document {
    jobId: mongoose.Schema.Types.ObjectId;
  message: string;

  isSeen: boolean;
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  notificationType: string;
}

// Define the Notification schema
const notificationSchema = new Schema<INotification>(
  {
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        },
    message: {
      type: String,
      required: [true, "Message is required"],
    },

    isSeen: {
      type: Boolean,
      default: false,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    notificationType: {
      type: String,
      required: [true, "Notification type is required"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Notification model
const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
