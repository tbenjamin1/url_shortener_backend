import { sequelize } from '../config/database.js';
import UserModel from './userModel.js';
import UrlModel from './urlModel.js';

// Use the existing sequelize instance that has SSL configuration
// instead of creating a new one

// Initialize models
const User = UserModel(sequelize);
const Url = UrlModel(sequelize);

// Define associations
User.hasMany(Url, { foreignKey: 'user_id' });
Url.belongsTo(User, { foreignKey: 'user_id' });

// Sync models with the database (optional, use with caution in production)
const syncDatabase = async () => {
  try {
    await sequelize.sync(); // This will create the tables if they don't exist
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Export models and sequelize instance
export { User, Url, syncDatabase };