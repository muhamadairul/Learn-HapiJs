const db = require("../../config/db");
const BaseModel = require("./baseModels");

class ProductCategory extends BaseModel {
  constructor() {
    super("product_categories"); 
  }

  async findByName(name) {
    return db.table(this.table).where({ name }).first();
  }
}

module.exports = new ProductCategory();
