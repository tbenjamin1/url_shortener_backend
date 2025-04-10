import jwt from "jsonwebtoken";
import { User } from "../models/index.js"; // Correct import
import { sequelize } from "../config/database.js";

const tokenBlacklist = new Map();

// Blacklist tokens
const blacklistToken = (token, expiresIn) => {
  const expiryDate = Date.now() + expiresIn * 1000;
  tokenBlacklist.set(token, expiryDate);
};

// Check if a token is blacklisted
const isTokenBlacklisted = (token) => {
  const expiryDate = tokenBlacklist.get(token);
  if (expiryDate) {
    if (Date.now() < expiryDate) {
      return true;
    } else {
      tokenBlacklist.delete(token);
    }
  }
  return false;
};

// Cleanup expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, expiryDate] of tokenBlacklist.entries()) {
    if (now >= expiryDate) {
      tokenBlacklist.delete(token);
    }
  }
}, 60 * 1000);

// Authentication middleware
export const authenticate = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!accessToken || isTokenBlacklisted(accessToken)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Rate limiting middleware
export const rateLimiter = (options) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = "Too many requests",
  } = options;

  const ipRequests = new Map();

  const cleanup = () => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now - data.resetTime > windowMs) {
        ipRequests.delete(ip);
      }
    }
  };

  setInterval(cleanup, windowMs);

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, { count: 1, resetTime: now });
      return next();
    }

    const data = ipRequests.get(ip);

    if (now - data.resetTime > windowMs) {
      data.count = 1;
      data.resetTime = now;
      return next();
    }

    data.count++;
    if (data.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
};
