const Joi = require("@hapi/joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  category_id: Joi.number().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  category_id: Joi.number().optional(),
  price: Joi.number().optional(),
  stock: Joi.number().optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
