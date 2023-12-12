const { CartModel, Product } = require("../Association/associate");
const { CustomError } = require("../utils/CustomError");
const cartController = {
  addorUpdateCart: async (req, res, next) => {
    // Function to add item to the cart
    const { body } = req;
    let fetchedcart, newQuantity, fetchedproduct;
    CartModel.findOne({ where: { userid: body.id } })
      .then((cart) => {
        fetchedcart = cart;

        return fetchedcart.getCartproducts({
          where: { prodId: body.prodId },
        });
      })
      .then((cartproducts) => {
        if (cartproducts.length) {
          newQuantity = cartproducts[0].CartProducts.quantity + body.quantity;
          return Product.findOne({ where: { product_code: body.prodId } });
        } else if (!cartproducts.length && body.quantity <= 0) {
          throw new CustomError(404, "no products in cart to reduce quantity");
        } else {
          newQuantity = body.quantity;
          return Product.findOne({ where: { product_code: body.prodId } });
        }
      })
      .then(async (product) => {
        if (!product) {
          throw new CustomError(404, `${body.prodId} no product found`);
        }
        if (newQuantity <= 0) {
          fetchedcart.update({
            total_price:
              fetchedcart.total_price - fetchedcart.quantity * product.price,
          });
           await fetchedcart.removeCartproducts(product);

          return;
        }

        fetchedproduct = product;
        return fetchedcart.addCartproduct(product, {
          through: {
            quantity: newQuantity,
            price: product.price * newQuantity,
          },
        });
      })
      .then(async (updated) => {
        if (updated) {
          if (body.quantity < 0) {
            await fetchedcart.update({
              total_price:
                fetchedcart.total_price - fetchedproduct.price * newQuantity,
            });
          } else {
            await fetchedcart.update({
              total_price:
                fetchedcart.total_price + fetchedproduct.price * body.quantity,
            });
          }

          return res.status(201).json("updated successfully");
        }
        return res.status(201).json("updated successfully");
      })
      .catch((err) => {
        
        next(new CustomError(400, err));
      });
  },

  getCart: async (req, res, next) => {
    const { body } = req;
    // Function to get cart items
    CartModel.findOne({ where: { userid: body.id } })
      .then((cart) => {
        return cart.getCartproducts({
          through: { where: { cartId: body.cartId } },
        });
      })
      .then((cartItems) => {
        return cartItems.map((element)=>{
          return [element.CartProducts,{product:element.Product,price:element.price}]
        })
      }).then((data)=>{
        if(!data.length){
          return res.status(404).send('no items found')
        }
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  },
  removeFromCart: async (req, res, next) => {
    // Function to remove an item from the cart
    const { body } = req;
    let fetchedcart;
    CartModel.findOne({ where: { userid: body.id } })
      .then(async (cart) => {
        if (!cart) {
          throw "no cart found";
        }
        fetchedcart = cart;
        return Product.findByPk(req.params.prodId);
      })
      .then((product) => {
        if (!product) {
          throw "no such product exist to delete";
        }
        return fetchedcart.removeCartproduct(product);
      })
      .then((removed) => {
        res
          .status(200)
          .json(
            removed
              ? "succesfully removed from cart"
              : "no product found in cart"
          );
      })
      .catch((err) => {
        next(new CustomError(404, err));
      });
  },
};

module.exports = cartController;
