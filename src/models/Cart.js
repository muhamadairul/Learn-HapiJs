const db = require("../../config/db");
const BaseModel = require("./baseModels");

class Cart extends BaseModel {
  constructor() {
    super("carts");
  }

  async findByProductId(productId) {
    return db.table(this.table).where({ 'product_id': productId }).first();
  }

  async findWithProduct(id) {
    return db
      .table(this.table)
      .join('products', 'carts.product_id', '=', 'products.id')
      .where('carts.id', id)
      .select('carts.*', 'products.name', 'products.price', 'products.description')
      .first();
  }

  async getAllWithProducts() {
    return db
      .table(this.table)
      .join('products', 'carts.product_id', '=', 'products.id')
      .select(
        'carts.*', 
        'products.name as product_name', 
        'products.price as product_price', 
        'products.description as product_description',
        'products.category_id'
      );
  }

  async clearAll() {
    return db.table(this.table).del();
  }
}

module.exports = new Cart();