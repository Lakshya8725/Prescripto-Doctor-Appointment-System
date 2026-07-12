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

const corsOptions =
  allowedOrigins.length > 2
    ? {
        origin(origin, callback) {
          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }
    : {
        origin: true,
        credentials: true,
      };

if (allowedOrigins.length <= 2) {
  console.warn(
    "FRONTEND_URL/ADMIN_URL not set — CORS is open. Set both on Render after Vercel deploy.",
  );
}

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

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

// Multer / upload / CORS errors → JSON (prevents axios "Network Error")
app.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ success: false, message: "Image must be under 5MB" });
  }
  if (err?.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
