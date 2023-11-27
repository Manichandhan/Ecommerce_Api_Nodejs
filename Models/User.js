// Import Sequelize and the database connection instance
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConnection'); 

// Define the User model
class User extends Model {}

User.init(
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address:{
        type:DataTypes.STRING,
        allowNull:true,
    }
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false    
  }
);

module.exports = User;
