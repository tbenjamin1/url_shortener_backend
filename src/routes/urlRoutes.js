import express from 'express';
import * as urlController from '../controllers/urlController.js';
import { authenticate, rateLimiter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limit for URL creation
const createUrlRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: 'Too many URL creation attempts, please try again later'
});

// URL routes
router.post('/shorten', authenticate, createUrlRateLimiter, urlController.shortenUrl);
router.get('/urls', authenticate, urlController.getUserUrls);
router.get('/analytics/:shortUrl', authenticate, urlController.getUrlAnalytics);
router.get('/:shortCode', urlController.redirectToUrl);
router.get('/share/urls', authenticate, urlController.getShareableUrls);


export default router;