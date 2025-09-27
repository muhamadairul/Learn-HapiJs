const Orders = require("../models/Orders");

class OrderController {
  async index(request, h) {
    const orders = await Orders.all();
    return h.response(orders);
  }

  async show(request, h) {
    const { id } = request.params;
    const order = await Orders.findWithDetails(id);

    if (!order) {
      return h.response({ message: "Order not found" }).code(404);
    }
    return h.response(order);
  }

  async store(request, h) {
    try {
      const { user_id, total_amount, status, details } = request.payload;

      const [order] = await Orders.create({
        user_id,
        total_amount,
        status: status || "PENDING",
      });

      if (details && details.length > 0) {
        for (const d of details) {
          await Orders.addOrderDetail(order.id, d.product_id, d.quantity, d.price);
        }
      }

      return h.response(order).code(201);
    } catch (err) {
      console.error("Error in store:", err);
      return h
        .response({ message: "Failed to create order", error: err.message })
        .code(500);
    }
  }

  async update(request, h) {
    const { id } = request.params;
    const { user_id, total_amount, status } = request.payload;

    const [updated] = await Orders.update(id, { user_id, total_amount, status });

    if (!updated) {
      return h.response({ message: "Order not found" }).code(404);
    }
    return h.response(updated);
  }

  async destroy(request, h) {
    const { id } = request.params;
    const deleted = await Orders.delete(id);

    if (!deleted) {
      return h.response({ message: "Order not found" }).code(404);
    }
    return h.response({ message: "Order deleted successfully" });
  }
}

module.exports = new OrderController();
