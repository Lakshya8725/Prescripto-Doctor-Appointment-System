import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import cloudinary from "cloudinary";

/* ================= DOCTOR LIST ================= */
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= CHANGE AVAILABILITY ================= */
const changeAvailability = async (req, res) => {
  try {
    const docId = req.doctor.id;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      available: doctor.available,
      message: "Availability updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DOCTOR LOGIN ================= */
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DOCTOR APPOINTMENTS ================= */
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const appointments = await appointmentModel
      .find({ docId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= COMPLETE APPOINTMENT ================= */
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment completed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= CANCEL APPOINTMENT (DOCTOR) ================= */
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    appointment.cancelled = true;
    await appointment.save();

    // release slot
    const doctor = await doctorModel.findById(docId);
    if (doctor?.slots_booked?.[appointment.slotDate]) {
      doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[
        appointment.slotDate
      ].filter((t) => t !== appointment.slotTime);
      await doctor.save();
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DOCTOR DASHBOARD ================= */
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patients = new Set();

    appointments.forEach((item) => {
      if (!item.cancelled && (item.payment || item.isCompleted)) {
        earnings += Number(item.amount || 0);
      }
      if (item.userId) patients.add(item.userId.toString());
    });

    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: appointments.length,
        patients: patients.size,
        latestAppointments: appointments
          .sort((a, b) => b.date - a.date)
          .slice(0, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DOCTOR PROFILE ================= */
const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE PROFILE ================= */
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.id;
    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const { name, fees, experience, about, address } = req.body;

    if (name) doctor.name = name;
    if (fees) doctor.fees = fees;
    if (experience) doctor.experience = experience;
    if (about) doctor.about = about;
    if (address) doctor.address = JSON.parse(address);

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      doctor.image = upload.secure_url;
    }

    await doctor.save();
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= EXPORTS ================= */
export {
  doctorList,
  changeAvailability,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
};
