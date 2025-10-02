const CartController = require('../controllers/CartController');

module.exports = [
  {
    method: 'GET',
    path: '/carts',
    handler: CartController.index
  },
  {
    method: 'GET',
    path: '/carts/{id}',
    handler: CartController.show
  },
  {
    method: 'POST',
    path: '/carts',
    handler: CartController.store
  },
  {
    method: 'PUT',
    path: '/carts/{id}',
    handler: CartController.update
  },
  {
    method: 'DELETE',
    path: '/carts/{id}',
    handler: CartController.destroy
  },
  {
    method: 'DELETE',
    path: '/carts/clear',
    handler: CartController.clear
  }
];

