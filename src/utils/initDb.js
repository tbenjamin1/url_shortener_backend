import { sequelize } from '../config/database.js';
// Import your models here if needed

export const initializeDatabase = async () => {
  console.log('Initializing database schema...');
  try {
    // Force: false ensures it doesn't drop tables
    await sequelize.sync({ force: false });
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    // Log error but continue execution
    console.log('Database schema initialization encountered errors, but server will continue');
  }
};