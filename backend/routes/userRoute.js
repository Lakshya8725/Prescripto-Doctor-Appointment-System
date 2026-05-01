import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// Profile
userRouter.get("/get-profile", authUser, getProfile);
// Auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile,
);

export default userRouter;
