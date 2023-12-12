const express = require("express");
const router = express.Router();

// async handler
const { tryCatch } = require("../utils/tryCatch");
// Import controllers
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const cartController = require("../controllers/cartController");

// Product routes
router.get("/products", tryCatch(productController.getAllProducts));
router.get("/products/:id", tryCatch(productController.getProductById));
router.post("/products", tryCatch(productController.createProduct));
router.put(
  "/products/:id/:prodcode",
  tryCatch(productController.updateProduct)
);
router.delete(
  "/products/:prodcode/:id",
  tryCatch(productController.deleteProduct)
);

// User routes
router.get("/users", tryCatch(userController.getAllUsers));
router.get("/users/:id", tryCatch(userController.getUserById));
router.post("/users", tryCatch(userController.createUser));
router.put("/users/restore", tryCatch(userController.restoreUser));
router.put("/users/:id", tryCatch(userController.updateUser));
router.delete("/users/:id", tryCatch(userController.deleteUser));

// Order routes
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.post("/orders", orderController.createOrder);
router.post("/orders/buynow", orderController.buyNowOrder);
router.delete("/orders/:id", orderController.deleteOrder);

// Cart routes
router.post("/cart/addorUpdate", tryCatch(cartController.addorUpdateCart));
router.get("/cart", cartController.getCart);
router.delete("/cart/remove/:prodId", cartController.removeFromCart);

module.exports = router;
