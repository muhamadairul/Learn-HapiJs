const ProductController = require("../controllers/ProductController");
const { createProductSchema, updateProductSchema } = require("../validations/productValidation");

module.exports = [
  {
    method: "GET",
    path: "/products",
    handler: ProductController.index,
  },
  {
    method: "GET",
    path: "/products/{id}",
    handler: ProductController.show,
  },
  {
    method: "POST",
    path: "/products",
    options: {
      validate: {
        payload: createProductSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: ProductController.store,
  },
  {
    method: "PUT",
    path: "/products/{id}",
    options: {
      validate: {
        payload: updateProductSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: ProductController.update,
  },
  {
    method: "DELETE",
    path: "/products/{id}",
    handler: ProductController.destroy,
  },
];
