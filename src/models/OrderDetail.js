const db = require("../../config/db");
const BaseModel = require("./baseModels");

class OrderDetails extends BaseModel {
  constructor() {
    super("order_details");
  }

  async findByOrder(orderId) {
    return await db("order_details").where({ order_id: orderId });
  }
}

module.exports = new OrderDetails();
