const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConnection");
const shortid=require('shortid')

// Define the User model

 class Order extends Model {}

Order.init(
  {
    // Define model attributes
   orderId:{
    type:DataTypes.STRING,
    allowNull:false,
    primaryKey:true,
    set(val){
       
          const generateId=shortid.generate()
          this.setDataValue('orderId',generateId+"-"+val)
    }
   },
    TotalPrice:{
        type:DataTypes.INTEGER,
        allowNull:false
    }, 
    address:{
      type:DataTypes.STRING,  
      allowNull:false 
    } 
  },
  { 
    sequelize,
    tableName: "Orders",
    timestamps: true,
    createdAt:'created_at',
    updatedAt:false
  }
);

module.exports = Order;