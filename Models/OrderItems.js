const {DataTypes,Model}=require('sequelize')
const sequelize=require('../config/dbConnection')
const { extend } = require('lodash')


class OrderItem extends Model{}


OrderItem.init({
    
    id:{
     type:DataTypes.INTEGER,
     autoIncrement:true,
     primaryKey:true,
     allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }

},{
    sequelize,
    timestamps:false,
    modelName:'Orderitems', 
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
     
})

 
module.exports=OrderItem