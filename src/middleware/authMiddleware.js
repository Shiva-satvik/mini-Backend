const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is missing.",
      });
    }

  
    // Authorization: Bearer <token>
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded payload
    req.user = {
      userId: decoded.userId,
    };

    next();

  } catch (error) {

    console.error("JWT Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });

  }
};

module.exports = authMiddleware;