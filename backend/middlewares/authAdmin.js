import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again",
      });
    }

    // Support both "Bearer <token>" and raw token in header
    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not Authorized" });
    }

    // Attach admin info for downstream handlers (if needed)
    req.user = { email: decoded.email, role: decoded.role };

    return next();
  } catch (error) {
    console.error("authAdmin error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
