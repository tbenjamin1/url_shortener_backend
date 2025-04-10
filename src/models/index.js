
import { Sequelize } from 'sequelize';
import UserModel from './userModel.js';
import UrlModel from './urlModel.js';

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or 'postgres', 
});

// Initialize models
const User = UserModel(sequelize);
const Url = UrlModel(sequelize);

// Define associations
User .hasMany(Url, { foreignKey: 'user_id' });
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
export { sequelize, User, Url, syncDatabase };