const db = require("../../config/db");
const BaseModel = require("./baseModels");

class PaymentMethod extends BaseModel {
  constructor() {
    super("payment_methods"); 
  }

  async findByName(name) {
    return db.table(this.table).where({ name }).first();
  }
}

module.exports = new PaymentMethod();
