const Joi = require("@hapi/joi");

const createProductCategorySchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
});

const updateProductCategorySchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(1000).optional(),
});

module.exports = {
  createProductCategorySchema,
  updateProductCategorySchema,
};
