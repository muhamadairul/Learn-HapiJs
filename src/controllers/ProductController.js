const Product = require("../models/Product");

class ProductController {
  async index(request, h) {
    const data = await Promise.all(
      (
        await Product.all()
      ).map(async (product) => {
        const prod_cat = await ProductCategory.find(product.category_id);
        return { ...product, prod_cat };
      })
    );
    return h.response(data);
  }

  async show(request, h) {
    const { id } = request.params;
    const product = await Promise.all(
      (
        await Product.find(id)
      ).map(async (product) => {
        const prod_cat = await ProductCategory.find(product.category_id);
        return { ...product, prod_cat };
      })
    )
    return h.response(product);
  }

  async store(request, h) {
    try {
      const { name, description, category_id, price, stock } = request.payload;

      // cek duplikasi nama
      if (await Product.findByName(name)) {
        return h.response({ message: "Product already exists" }).code(400);
      }

      // create
      const [newPay] = await Product.create({ name, description, category_id, price, stock });
      return h.response(newPay).code(201);
    } catch (err) {
      console.error("Error in store:", err); // log ke console
      return h
        .response({ message: "Failed to create product", error: err.message })
        .code(500);
    }
  }

  async update(request, h) {
    const { id } = request.params;
    const { name, description, category_id, price, stock } = request.payload;
    const [updateMethod] = await Product.update(id, { name, description, category_id, price, stock });
    if (!updateMethod)
      return h.response({ message: "Product not found" }).code(404);
    return h.response(updateMethod);
  }

  async destroy(request, h) {
    const { id } = request.params;
    const deleted = await Product.delete(id);
    if (!deleted) return h.response({ message: "Product not found" }).code(404);
    return h.response({ message: "Product deleted successfully" });
  }
}

module.exports = new ProductController();
