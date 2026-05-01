import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Ensure role is doctor
    if (decoded.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 5️⃣ Attach doctor info
    req.doctor = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authDoctor;
