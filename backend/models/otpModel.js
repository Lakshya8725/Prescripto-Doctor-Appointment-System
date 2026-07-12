import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  target: { type: String, required: true },
  channel: { type: String, enum: ["email", "phone"], required: true },
  purpose: { type: String, default: "signup" },
  otpHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

otpSchema.index({ target: 1, channel: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel =
  mongoose.models.Otp || mongoose.model("Otp", otpSchema);

export default otpModel;
