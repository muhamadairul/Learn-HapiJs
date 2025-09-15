const Order = require("../models/Order");
const Users = require("../models/Users");

class OrderController {
  async index(request, h) {
    const response = await Order.all();
    const data = await Promise.all(
      response.map(async (order) => {
        const user = await Users.find(order.user_id);
        const orderDetails = await Order.getOrderDetails(order.id);
        order.details = orderDetails;
        const orderPayments = await Order.getOrderPayments(order.id);
        order.payments = orderPayments;
        return { ...order, user };
      })
    );
    return h.response(data);
  }

  async show(request, h) {
    const { id } = request.params;
    const order = await Order.find(id);
    if (!order) return h.response({ message: "Order not found" }).code(404);
    const user = await Users.find(order.user_id);
    const orderDetails = await Order.getOrderDetails(order.id);
    order.details = orderDetails;
    const orderPayments = await Order.getOrderPayments(order.id);
    order.payments = orderPayments;
    return h.response({ ...order, user });
  }

  async store(request, h) {
    const { user_id, total_amount, status } = request.payload;
    if (!(await Users.find(user_id))) {
      return h.response({ message: "User not found" }).code(400);
    }
    const [newOrder] = await Order.create({ user_id, total_amount, status });
    return h.response(newOrder).code(201);
  }

  async updateStatus(request, h) {
    const { id } = request.params;
    const { status } = request.payload;
    const [updatedOrder] = await Order.update(id, { status });
    if (!updatedOrder)
      return h.response({ message: "Order not found" }).code(404);
    return h.response(updatedOrder);
  }
}

module.exports = new OrderController();
