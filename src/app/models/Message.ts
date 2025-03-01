// models/Message.ts
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  // jobId: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
