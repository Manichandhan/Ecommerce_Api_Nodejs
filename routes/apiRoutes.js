const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const cartController=require('../controllers/cartController')

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Order routes
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

// Cart routes
router.post('/cart/add', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.put('/cart/update/:productId', cartController.updateCartItem);
router.delete('/cart/remove/:productId', cartController.removeFromCart);

module.exports = router;
