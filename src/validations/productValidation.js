const Joi = require("@hapi/joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional().allow(""),
  category_id: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.any().optional(), 
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(""),
  category_id: Joi.number().integer().positive().optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  image: Joi.any().optional(), 
});

const createProductDataSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional().allow(""),
  category_id: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
});

const updateProductDataSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(""),
  category_id: Joi.number().integer().positive().optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  createProductDataSchema,
  updateProductDataSchema,
};
