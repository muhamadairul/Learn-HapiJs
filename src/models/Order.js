const db = require("../../config/db");
const BaseModel = require("./baseModels");

class Orders extends BaseModel {
  constructor() {
    super("orders");
  }

  async findWithDetails(id) {
    const order = await db("orders").where({ id }).first();
    if (!order) return null;

    const details = await db("order_details").where({ order_id: id });
    return { ...order, details };
  }

  async getOrderDetails(orderId) {
    return await db("order_details").where({ order_id: orderId });
  }

  async addOrderDetail(orderId, product_id, quantity, price) {
    const [detail] = await db("order_details")
      .insert({ order_id: orderId, product_id, quantity, price })
      .returning("*");
    return detail;
  }

  async updateOrderDetail(detailId, data) {
    const [updated] = await db("order_details")
      .where({ id: detailId })
      .update(data)
      .returning("*");
    return updated;
  }

  async deleteOrderDetail(detailId) {
    return await db("order_details").where({ id: detailId }).del();
  }
}

module.exports = new Orders();
