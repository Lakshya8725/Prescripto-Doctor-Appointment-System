import crypto from "crypto";
import bcrypt from "bcrypt";
import otpModel from "../models/otpModel.js";
import { sendOtpEmail } from "./sendEmail.js";
import { sendOtpSms } from "./sendSms.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

const generateOtp = () =>
  String(crypto.randomInt(100000, 999999));

export const sendOtp = async ({
  target,
  channel,
  purpose = "signup",
  name,
}) => {
  const recent = await otpModel.findOne({ target, channel, purpose }).sort({
    createdAt: -1,
  });

  if (
    recent &&
    !recent.verified &&
    Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    const waitSec = Math.ceil(
      (RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000,
    );
    throw new Error(`Wait ${waitSec}s before requesting another OTP`);
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  await otpModel.deleteMany({ target, channel, purpose, verified: false });

  await otpModel.create({
    target,
    channel,
    purpose,
    otpHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });

  let delivery = { sent: false, dev: true };
  if (channel === "email") {
    delivery = await sendOtpEmail(target, otp, name);
  } else if (channel === "phone") {
    delivery = await sendOtpSms(target, otp);
  }

  const response = {
    success: true,
    message:
      channel === "email"
        ? "OTP sent to your email"
        : "OTP sent to your phone",
    expiresInMinutes: 10,
  };

  if (delivery.dev && process.env.NODE_ENV !== "production") {
    response.devMode = true;
    response.devOtp = otp;
    response.message += " (dev mode — OTP shown below for testing)";
  }

  return response;
};

export const verifyOtp = async ({
  target,
  channel,
  otp,
  purpose = "signup",
}) => {
  const record = await otpModel
    .findOne({ target, channel, purpose, verified: false })
    .sort({ createdAt: -1 });

  if (!record) {
    throw new Error("OTP expired or not found. Request a new one.");
  }

  if (record.expiresAt < new Date()) {
    await otpModel.deleteOne({ _id: record._id });
    throw new Error("OTP expired. Request a new one.");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new Error("Too many attempts. Request a new OTP.");
  }

  const isValid = await bcrypt.compare(otp, record.otpHash);
  if (!isValid) {
    record.attempts += 1;
    await record.save();
    throw new Error(
      `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempts left.`,
    );
  }

  record.verified = true;
  await record.save();

  return { success: true, message: `${channel} verified successfully` };
};

export const isVerified = async ({ target, channel, purpose = "signup" }) => {
  const record = await otpModel.findOne({
    target,
    channel,
    purpose,
    verified: true,
  });
  return Boolean(record);
};

export const clearVerifications = async ({ email, phone, purpose = "signup" }) => {
  await otpModel.deleteMany({
    purpose,
    $or: [
      { target: email, channel: "email" },
      { target: phone, channel: "phone" },
    ],
  });
};
