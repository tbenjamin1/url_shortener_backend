import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, rateLimiter } from '../middleware/authMiddleware.js';

const router = express.Router();

const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many authentication attempts, please try again later'
});

//  routes
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);

// Google  routes
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback, authController.socialLoginCallback);

// GitHub  routes
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback, authController.socialLoginCallback);
router.post('/logout', authenticate, authController.logout);

export default router;