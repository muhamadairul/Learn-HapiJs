const PaymentMethod = require('../models/PaymentMethod');

class PaymentMethodController {
  async index(request, h) {
    const data = await PaymentMethod.all();
    return h.response(data);
  }

  async show(request, h) {
    const { id } = request.params;
    const payment_method = await PaymentMethod.find(id);
    if (!payment_method) return h.response({ message: 'Payment method not found' }).code(404);
    return h.response(payment_method);
  }

  async store(request, h) {
    const { name } = request.payload;
    console.log(name);
    if (await PaymentMethod.findByName(name)) {
      return h.response({ message: 'Payment method already exists' }).code(400);
    }
    const [newPay] = await PaymentMethod.create({ name });
    return h.response(newPay).code(201);
  }

  async update(request, h) {
    const { id } = request.params;
    const { name } = request.payload;
    const [updateMethod] = await PaymentMethod.update(id, { name });
    if (!updateMethod)
      return h.response({ message: 'Payment method not found' }).code(404);
    return h.response(updateMethod);
  }

  async destroy(request, h) {
    const { id } = request.params;
    const deleted = await PaymentMethod.delete(id);
    if (!deleted)
      return h.response({ message: 'Payment method not found' }).code(404);
    return h.response({ message: 'Payment method deleted successfully' });
  }
}

module.exports = new PaymentMethodController();
