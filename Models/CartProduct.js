const sequelize = require("../config/dbConnection");
const { DataTypes } = require("sequelize"); 
const CartModel = require("../Models/cart");
const ProductModel = require("../Models/products");
const CartProduct = sequelize.define("CartProducts", {
   quantity:{
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0
  },
  price:{
   type:DataTypes.INTEGER,
   allowNull:false
  }
}); 

module.exports = { CartProduct };
