import { syncDatabase } from '../models/index.js';

async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');
    
    // Use the syncDatabase function from your models/index.js
    await syncDatabase();
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}
 
export { initializeDatabase };