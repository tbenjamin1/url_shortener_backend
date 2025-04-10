import { syncDatabase } from "../models/index.js";

async function initializeDatabase() {
  try {
    await syncDatabase();
  } catch (error) {
    throw error;
  }
}

export { initializeDatabase };
