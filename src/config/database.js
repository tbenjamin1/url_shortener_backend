import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Create Sequelize instance with proper SSL support for Render
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Allow self-signed certificates, required for Render
      },
    },
    logging: false,
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error; // Rethrow to let server.js handle it
  }
};

export { sequelize, testConnection };