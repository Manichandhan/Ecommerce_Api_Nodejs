const shortid = require("shortid");
const { Order, User, CartModel, Product } = require("../Association/associate");
const { CustomError } = require("../utils/CustomError");

const orderController = {
  getAllOrders: async (req, res, next) => {
    // Logic to fetch all orders
    let { body } = req;
    const orders = await Order.findAll({ where: { UserId: body.id } });
    if (!orders.length) {
      return res.status(404).send("no orders to show");
    }
    const products = await Promise.all(
      orders.map((order) => {
        return order.getProducts();
      })
    );

    res.status(200).json({ orders: orders, products: products });
  },
  getOrderById: async (req, res, next) => {
    // Logic to fetch order by ID
    let { body } = req;
    const orderId = req.params.id + body.date;
    console.log(orderId);
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send("no order found");
    }
    const product = await order.getProducts();

    res.status(200).json({ product });
  },
  createOrder: async (req, res, next) => {
    // Logic to create a new order
    const { body } = req;

    try {
      const cart = await CartModel.findOne({ where: { userid: body.id } });

      if (!cart ) {
        
        return res.status(404).send("No products in the cart");
      }

      const cartproducts = await cart.getCartproducts();
      
      if (!cartproducts.length) {
        return res.status(404).send("No products in the cart");
      }
      const user = await User.findByPk(body.id);

      const timestamps = Date.now();
      const date = new Date(timestamps);

      const order = await user.createOrder({
        orderId: cart.Cart_id + "-" + date.toLocaleString(),
        TotalPrice: cart.total_price,
        address: user.address,
      });
      const outofstock = [];
      let totalprice,flag=false
      // Prepare bulk update data for products
      cartproducts.forEach((product) => {
        if (product.quantity > product.CartProducts.quantity) {
          flag=true
          totalprice=product.CartProducts.quantity*product.price
          Product.update(
            {
              quantity: product.quantity - product.CartProducts.quantity,
            },
            { where: { Product_code: product.Product_code } }
          );
        } else {
         
          outofstock.push(
            ` only ${product.quantity} ${product.Product} available please buy later`
          );
        }
      });
       if(!flag){
        order.destroy()
        return res.status(404).json({message:outofstock})}
      cartproducts.forEach((element) => {
        if (element.quantity > element.CartProducts.quantity) {
          order.addProducts(element, {
            through: { quantity: element.CartProducts.quantity },
          });
          cart.removeCartproducts(element);
        }
      });
      cart.update({total_price:cart.total_price-totalprice})
      let orderitems=order.getProducts()
      
       if(outofstock.length){
        return res.status(400).json({message:outofstock,orderitems})
       }
       
      return res.status(201).json('created order successfully');
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error creating order");
    }
  },
  buyNowOrder: async (req, res, next) => {
    try {
      const { body } = req;
      let orderprice = 0;

      const products = await Promise.all(
        body.buynow.products.map(async (item) => {
          const product = await Product.findByPk(item[0]);
          console.log(product);
          orderprice += product.price * item[1];
          return [product, item[1]];
        })
      );

      const user = await User.findByPk(body.id);
      const timestamps = Date.now();
      const date = new Date(timestamps);
      const order = await user.createOrder({
        orderId: shortid.generate() + "-" + date.toLocaleString(),
        TotalPrice: orderprice,
        address: user.address,
      });

      for (const product of products) {
        await order.addProduct(product[0], {
          through: { quantity: product[1] },
        });
        await product.update({ quantity: product.quantity - product[1] });
      }

      const orderProducts = await order.getProducts();
      res.status(201).json(orderProducts);
    } catch (err) {
      console.log(err);
      next(new CustomError(400, err));
    }
  },

  deleteOrder: async (req, res) => {
    let { body } = req;
    const orderId = req.params.id + body.date;
    // Logic to delete order by ID

    try {
      const deleted = await Order.destroy({ where: { orderId: orderId } });
      if (deleted) {
        return res
          .status(200)
          .json({ message: "deleted successfully", deleted });
      }
      res.status(404).json(deleted);
    } catch (error) {
      next(new CustomError(404, error));
    }
  },
};

module.exports = orderController;
