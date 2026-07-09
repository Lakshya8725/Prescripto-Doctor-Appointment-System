import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

//app configuration
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / Postman requests with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

//api endpoints
app.use("/api/admin", adminRouter);
//localhost:4000/api/admin
app.use("/api/doctor", doctorRouter);

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("api is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API healthy" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
