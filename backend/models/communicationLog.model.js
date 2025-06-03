import mongoose from "mongoose";

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export const CommunicationLog = mongoose.model(
  "CommunicationLog",
  communicationLogSchema
);
