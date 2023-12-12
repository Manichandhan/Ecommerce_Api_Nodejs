// Import Sequelize and the database connection instance
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConnection");

const bcrypt=require('bcrypt')
// Define the User model
class User extends Model {}

User.init(
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,  
      validate: {
        isEmail: true,
      },
      set(val){
        this.setDataValue('email',val.toLowerCase())
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val){
        const hash=bcrypt.hashSync(val,12)
        this.setDataValue('password',hash)
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    indexes: [{ unique: true,fields:['username'] },{unique:true,fields:['email']}], 
    timestamps: true,
    createdAt: "createdUserAt",
    paranoid: true,
    deletedAt: "deletedUserAt",   
  }
);

module.exports = User;
