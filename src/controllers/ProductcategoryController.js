const ProductCategory = require("../models/ProductCategory");

class ProductCategoryController {
  async index(request, h) {
    const data = await ProductCategory.all();
    return h.response(data);
  }

  async show(request, h) {
    const { id } = request.params;
    const prod_cat = await ProductCategory.find(id);
    if (!prod_cat) return h.response({ message: "Product category not found" }).code(404);
    return h.response(prod_cat);
  }

  async store(request, h) {
    try {
      const { name, description } = request.payload;

      // cek duplikasi nama
      if (await ProductCategory.findByName(name)) {
        return h.response({ message: "Product category already exists" }).code(400);
      }

      // create
      const [newPay] = await ProductCategory.create({ name, description });
      return h.response(newPay).code(201);
    } catch (err) {
      console.error("Error in store:", err); // log ke console
      return h
        .response({ message: "Failed to create product category", error: err.message })
        .code(500);
    }
  }

  async update(request, h) {
    const { id } = request.params;
    const { name, description } = request.payload;
    const [updateMethod] = await ProductCategory.update(id, { name, description });
    if (!updateMethod)
      return h.response({ message: "Product category not found" }).code(404);
    return h.response(updateMethod);
  }

  async destroy(request, h) {
    const { id } = request.params;
    const deleted = await ProductCategory.delete(id);
    if (!deleted) return h.response({ message: "Product category not found" }).code(404);
    return h.response({ message: "Product category deleted successfully" });
  }
}

module.exports = new ProductCategoryController();
