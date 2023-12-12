// Import Sequelize and the database connection instance
const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConnection");
class CartModel extends Model {}

CartModel.init(
  {
    Cart_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isNonNegative(value) {
          if (this.yourField !== undefined && value < 0) {
            throw new Error("The value must be 0 or greater.");
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Cart",
    timestamps: false,
    indexes:[{
      fields:['userid']
    }]
  }
);

module.exports = CartModel;
