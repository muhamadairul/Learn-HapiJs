const Orders = require("../models/Order");

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

      const orderCode = await generateOrderCode();
      const [order] = await Orders.create({
        user_id,
        total_amount,
        status: status || "PENDING",
        code: orderCode
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

async function generateOrderCode() {
  try {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

    const lastOrder = await Orders.findLastOrderToday();
    let sequence = 1;

    if (lastOrder && lastOrder.order_code) {
      const lastCode = lastOrder.order_code;
      const lastSequence = parseInt(lastCode.split("/")[2]) || 0;
      sequence = lastSequence + 1;
    }

    const sequencePart = sequence.toString().padStart(4, "0");

    return `ORD/${datePart}/${sequencePart}`;
  } catch (error) {
    console.error("Error generating order code:", error);
    const timestamp = Date.now().toString().slice(-6);
    return `ORD/EMG/${timestamp}`;
  }
}

module.exports = new OrderController();
