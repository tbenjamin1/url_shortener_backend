import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, rateLimiter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limit for authentication routes
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
});

// Authentication routes
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);

// Google OAuth routes
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback, authController.socialLoginCallback);

// GitHub OAuth routes
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback, authController.socialLoginCallback);

router.post('/logout', authenticate, authController.logout);

export default router;