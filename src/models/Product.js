const db = require("../../config/db");
const BaseModel = require("./baseModels");

class ProductCategory extends BaseModel {
  constructor() {
    super("products"); 
  }

  async findByName(name) {
    return db.table(this.table).where({ name }).first();
  }

  async findByCategory(categoryId) {
    return db.table(this.table).where({ category_id: categoryId }).select("*");
  }
}

module.exports = new ProductCategory();
