const User=require('../Models/User')
const Product=require('../Models/products')
const CartModel=require('../Models/cart')
const {CartProduct}=require('../Models/CartProduct')
const Order=require('../Models/orders')
const OrderItem=require('../Models/OrderItems')
// associate userAdmin with products

User.hasMany(Product,{foreignKey:'userid'})
Product.belongsTo(User,{foreignKey:'userid',onDelete:'CASCADE'}) 
 

// associate users with Cart
User.hasOne(CartModel,{foreignKey:'userid'})
CartModel.belongsTo(User,{foreignKey:'userid'})

// associate cart with products
CartModel.belongsToMany(Product,{ as:'cartproducts',through: CartProduct,foreignKey:'cartId'})
Product.belongsToMany(CartModel,{through:CartProduct,foreignKey:'prodId'}) 

// associate orders with user
User.hasMany(Order)
Order.belongsTo(User)

// associate products with orders
Order.belongsToMany(Product,{through:OrderItem,foreignKey:'orderId'}) 
Product.belongsToMany(Order,{through:OrderItem,foreignKey:'productId'})

module.exports={User,Product,CartModel,Order}