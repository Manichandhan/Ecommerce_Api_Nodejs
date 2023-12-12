// Import Sequelize and the database connection instance
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConnection");
const shortid=require('shortid')

// Define the User model

 class Product extends Model {}

Product.init(
  {
    // Define model attributes
    Product_code: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {
        return shortid.generate();
      }
    },
    brandname: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    Product: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 15],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default quantity is set to 0
    },
    category: {
      type: DataTypes.ENUM("Fruits", "Vegetables", "Dairy", "Meat"),
      allowNull: false,
    },
    price: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM(
        "kg", // Kilograms for meat, vegetables
        "g", // Grams for some fruits, small quantities
        "pieces", // Pieces for fruits, vegetables, or dairy items
        "liters" // Liters for liquids in dairy or beverages
        
      ),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Products",
    timestamps: false,
  }
);

module.exports = Product;
