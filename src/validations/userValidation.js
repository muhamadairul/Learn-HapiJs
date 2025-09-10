const Joi = require("@hapi/joi");

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.ref("password"),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
