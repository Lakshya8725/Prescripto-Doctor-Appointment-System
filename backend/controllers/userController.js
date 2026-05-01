import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const userData = await userModel.findById(id).select("-password");
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    const { id } = req.user;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(id, {
      name,
      phone,
      address: address ? JSON.parse(address) : {},
      dob,
      gender,
    });

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path);
      await userModel.findByIdAndUpdate(id, { image: upload.secure_url });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ================= BOOK APPOINTMENT =================
const bookAppointment = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
    slots_booked[slotDate].push(slotTime);

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    const userData = await userModel.findById(userId).select("-password");

    const docInfo = docData.toObject();
    delete docInfo.slots_booked;

    const appointment = await appointmentModel.create({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: docInfo,
      amount: docInfo.fees,
      date: Date.now(),
      cancelled: false,
      payment: false,
      isCompleted: false,
    });

    res.json({ success: true, message: "Appointment Booked", appointment });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ================= LIST APPOINTMENTS =================
const listAppointment = async (req, res) => {
  try {
    const { id: userId } = req.user;

    // ✅ DO NOT FILTER cancelled or completed
    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ================= CANCEL APPOINTMENT =================
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { id: userId } = req.user;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const doctorData = await doctorModel.findById(appointmentData.docId);
    if (doctorData) {
      let slots_booked = doctorData.slots_booked || {};
      if (slots_booked[appointmentData.slotDate]) {
        slots_booked[appointmentData.slotDate] = slots_booked[
          appointmentData.slotDate
        ].filter((t) => t !== appointmentData.slotTime);
      }
      await doctorModel.findByIdAndUpdate(appointmentData.docId, {
        slots_booked,
      });
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ================= RAZORPAY INSTANCE =================
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= MAKE PAYMENT =================
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    if (appointmentData.userId.toString() !== req.user.id) {
      return res.json({
        success: false,
        message: "Unauthorized payment attempt",
      });
    }

    if (!appointmentData.amount || appointmentData.amount <= 0) {
      return res.json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// ================= VERIFY PAYMENT =================
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
      payment: true,
      earningAdded: true, // ✅ IMPORTANT
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
