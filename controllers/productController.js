// productController.js
// Import Product model,userModel and perform necessary operations
const { includes } = require("lodash");
const { Product } = require("../Association/associate");
const { User } = require("../Association/associate");
const { CustomError } = require("../utils/CustomError");

const productController = {
  getAllProducts: async (req, res) => {
    // Logic to fetch all products

    const prods = await Product.findAll();
    if (prods.length) {
      return res.status(200).json(prods);
    } else {
      res.status(200).json("no Products to show");
    }
  },
  getProductById: async (req, res, next) => {
    // Logic to fetch product by ID
    Product.findByPk(req.params.id)
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).send("no product found");
        }
      })
      .catch((err) => {
        next(err);
      });
  },
  createProduct: async (req, res, next) => {
    // Logic to create a new product
    const { body } = req;
    const admin = new Promise((reso, rej) => {
      User.findOne({
        where: { username: body.username },
        include: Product,
      })
        .then((data) => {
          if (data == null) {
            rej(`${body.username} user not found`);
          } else if (data.isAdmin) {
            reso(data);
          } else {
            rej(`${body.username} is not admin`);
          }
        })
        .catch((err) => {
          if (err.name == "SequelizeDatabaseError") {
            return next(new CustomError(500, err));
          }
          next(new CustomError(404, err.msg));
        });
    });
    admin
      .then((data) => {
        let flag = true;
        data.Products.forEach((product) => {
          if (
            product.brandname == body.brandname &&
            product.description == body.description &&
            product.Product == body.product
          ) {
            flag = false;
          }
        });
        if (!flag) {
          throw "product already exist";
        }
        return data;
      })
      .then((data) => {
        data
          .createProduct({
            brandname: body.brandname,
            Product: body.product,
            description: body.description,
            quantity: body.quantity,
            category: body.category,
            price: body.price,
            unit: body.unit,
          })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            console.log(err);
            if (err.name == "SequelizeValidationError") {
              const validations = err.errors.map((obj) => {
                return obj.message;
              });
              return next({ message: "can't be null values", validations });
            } else if (err.name == "SequelizeDatabaseError") {
              return next(new CustomError(501, err));
            }

            next(err);
          });
      })
      .catch((err) => {
        console.log(err);
        next(new CustomError(404, err));
      });
  },
  updateProduct: async (req, res,next) => {
    // Logic to update a product by ID
const {body}=req
    // Assuming productIdToUpdate and userId are known (IDs of product and user) 
    Product.findByPk(req.params.prodcode, { where: { userId: req.params.id } }) 
      .then((product) => {
        if (product) {
          // Update attributes of the product
          return product.update({
            /* Attributes you want to update */
            quantity: body.quantity||product.quantity,
            price:body.price||product.price,
            unit:body.unit||product.unit
            // ... other attributes
          });
        }
        throw new Error("Product not found for this user.");
      })
      .then((updatedProduct) => {
        console.log("Updated product:", updatedProduct.toJSON());
        res.status(200).json({message:'updated successfully',updatedProduct})
      })
      .catch((error) => {
        next(new CustomError(503,error))
      });
  },
  deleteProduct: async (req, res,next) => {
    // Logic to delete a product by ID
    // Assuming productIdToDelete and userId are known (IDs of product and user)
Product.destroy({ where: { Product_code: req.params.prodcode, userid:req.params.id  } })
.then(rowsDeleted => {
  if (rowsDeleted > 0) {
    res.status(203).send('deleted successfully')
  } else {
    throw new Error('Product not found for this user.');
  }
})
.catch(error => {
  next(new CustomError(400,error))
});

  },
};

module.exports = productController;
