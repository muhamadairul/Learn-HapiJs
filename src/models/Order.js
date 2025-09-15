const db = require("../../config/db");
const BaseModel = require("./baseModels");

class Orders extends BaseModel {
  constructor() {
    super("orders"); 
  }

  async getOrderDetails(orderId) {
    const details = await db("order_details").where({ order_id: orderId });
    return details;
  }

  async getOrderPayments(orderId) {
    const payments = await db("order_payments").where({ order_id: orderId });
    return payments;
  }
}

module.exports = new Orders();
