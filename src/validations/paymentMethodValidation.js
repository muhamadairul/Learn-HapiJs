const Joi = require("@hapi/joi");

const createPaymentMethodSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
});

const updatePaymentMethodSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
});

module.exports = {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
};
