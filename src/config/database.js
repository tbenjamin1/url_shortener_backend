import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
// Create Sequelize instance with PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Changed from 'mysql' to 'postgres'
    logging: false // Set to console.log to see SQL queries
  }
);
// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
export { sequelize, testConnection };