const OrderController = require("../controllers/OrderController");

module.exports = [
  {
    method: 'GET',
    path: '/orders',
    handler: OrderController.index
  },
  {
    method: 'GET',
    path: '/orders/{id}',
    handler: OrderController.show
  },
  {
    method: 'POST',
    path: '/orders',
    handler: OrderController.store
  },
  {
    method: 'PUT',
    path: '/orders/{id}',
    handler: OrderController.update
  },
  {
    method: 'DELETE',
    path: '/orders/{id}',
    handler: OrderController.destroy
  }
];

