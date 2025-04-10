import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { initializeDatabase } from './utils/initDb.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import passport from "passport";
import "./controllers/authController.js";
dotenv.config();

// Initialize Express app
const app = express();
// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL : process.env.PROD_FRONTEND_URL,
  credentials: true
}));


app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
app.use('/auth', authRoutes);
app.use('/', urlRoutes);
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
// Server initialization
const PORT = process.env.PORT || 3000;
// Self-invoking async function to initialize database before starting server
(async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database schema
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
export default app; // Export for testing purposes