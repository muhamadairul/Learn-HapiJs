const ProductcategoryController = require("../controllers/ProductcategoryController");
const { createProductCategorySchema, updateProductCategorySchema } = require("../validations/productCategoryValidation");

module.exports = [
  {
    method: "GET",
    path: "/product-categories",
    handler: ProductcategoryController.index,
  },
  {
    method: "GET",
    path: "/product-categories/{id}",
    handler: ProductcategoryController.show,
  },
  {
    method: "POST",
    path: "/product-categories",
    options: {
      validate: {
        payload: createProductCategorySchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: ProductcategoryController.store,
  },
  {
    method: "PUT",
    path: "/product-categories/{id}",
    options: {
      validate: {
        payload: updateProductCategorySchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: ProductcategoryController.update,
  },
  {
    method: "DELETE",
    path: "/product-categories/{id}",
    handler: ProductcategoryController.destroy,
  },
];
