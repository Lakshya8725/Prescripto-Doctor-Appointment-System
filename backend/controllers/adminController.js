import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import { releaseSlot } from "../utils/slotBooking.js";
import userModel from "../models/userModel.js";

/* ================= ADD DOCTOR ================= */
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // 1️⃣ Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // 2️⃣ Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    // 3️⃣ Check duplicate doctor
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    // 4️⃣ Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 5️⃣ Validate image
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image not received",
      });
    }

    // 6️⃣ Parse address safely
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format",
      });
    }

    // 7️⃣ Hash doctor password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8️⃣ Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // 9️⃣ Save doctor
    const newDoctor = await doctorModel.create({
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: {
        _id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        speciality: newDoctor.speciality,
      },
    });
  } catch (error) {
    console.error("addDoctor error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= ADMIN LOGIN ================= */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Validate email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Validate password (plain for college project)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL DOCTORS ================= */
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    return res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

/* ================= GET ALL APPOINTMENTS ================= */
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 });
    return res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

/* ================= CANCEL APPOINTMENT ================= */
const appointmentCancel = async (req, res) => {
  try {
    console.log("🔥 CANCEL API HIT");
    console.log("appointmentId received:", req.body.appointmentId);

    const { appointmentId } = req.body;

    // 1️⃣ Find appointment
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 2️⃣ Already cancelled check
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // 3️⃣ UPDATE & SAVE (THIS IS THE KEY FIX)
    const { docId, slotDate, slotTime } = appointment;
    appointment.cancelled = true;
    await appointment.save();

    await releaseSlot(docId, slotDate, slotTime);

    return res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment, // return updated document
    });
  } catch (err) {
    console.error("Admin cancel error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//API to dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
/* ================= CHANGE DOCTOR AVAILABILITY (ADMIN) ================= */
const changeDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    return res.json({
      success: true,
      message: "Doctor availability updated",
      available: doctor.available,
    });
  } catch (err) {
    console.error("changeDoctorAvailability error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  changeDoctorAvailability,
};
