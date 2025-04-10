
import { DataTypes } from 'sequelize';
import crypto from 'crypto';

export default (sequelize) => {
  const Url = sequelize.define('Url', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    short_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    long_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'urls',
    timestamps: false 
  });

  
  return Url;
};