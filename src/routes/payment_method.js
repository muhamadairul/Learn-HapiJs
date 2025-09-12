const PaymnetMethodController = require("../controllers/PaymnetMethodController");
const { createPaymentMethodSchema, updatePaymentMethodSchema } = require("../validations/paymentMethodValidation");

module.exports = [
  {
    method: "GET",
    path: "/payment-methods",
    handler: PaymnetMethodController.index,
  },
  {
    method: "GET",
    path: "/payment-methods/{id}",
    handler: PaymnetMethodController.show,
  },
  {
    method: "POST",
    path: "/payment-methods",
    options: {
      validate: {
        payload: createPaymentMethodSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: PaymnetMethodController.store,
  },
  {
    method: "PUT",
    path: "/payment-methods/{id}",
    options: {
      validate: {
        payload: updatePaymentMethodSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: PaymnetMethodController.update,
  },
  {
    method: "DELETE",
    path: "/payment-methods/{id}",
    handler: PaymnetMethodController.destroy,
  },
];
