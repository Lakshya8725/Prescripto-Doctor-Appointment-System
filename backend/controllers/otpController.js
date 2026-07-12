import validator from "validator";
import { sendOtp, verifyOtp } from "../utils/otpService.js";
import { formatPhone } from "../utils/sendSms.js";
import userModel from "../models/userModel.js";

export const sendEmailOtp = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid email required" });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const result = await sendOtp({
      target: email.toLowerCase().trim(),
      channel: "email",
      name: name || "User",
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });
    }

    const result = await verifyOtp({
      target: email.toLowerCase().trim(),
      channel: "email",
      otp: String(otp).trim(),
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number required" });
    }

    let formattedPhone;
    try {
      formattedPhone = formatPhone(phone);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number",
      });
    }

    const existing = await userModel.findOne({ phone: formattedPhone });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Phone already registered" });
    }

    const result = await sendOtp({
      target: formattedPhone,
      channel: "phone",
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and OTP required" });
    }

    let formattedPhone;
    try {
      formattedPhone = formatPhone(phone);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number",
      });
    }

    const result = await verifyOtp({
      target: formattedPhone,
      channel: "phone",
      otp: String(otp).trim(),
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
