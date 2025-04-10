
import { Sequelize } from 'sequelize';
import UserModel from './userModel.js';
import UrlModel from './urlModel.js';


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',  
});

const User = UserModel(sequelize);
const Url = UrlModel(sequelize);

//  associations
User .hasMany(Url, { foreignKey: 'user_id' });
Url.belongsTo(User, { foreignKey: 'user_id' });

const syncDatabase = async () => {
  try {
    await sequelize.sync(); 
  } catch (error) {
  }
};

export { sequelize, User, Url, syncDatabase };