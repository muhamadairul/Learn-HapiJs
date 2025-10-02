const db = require("../../config/db");
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const path = require("path");
const fs = require("fs");

class ProductController {
  async index(request, h) {
    try {
      const { name, category, min_price, max_price, category_id } = request.query;

      let query = db
        .table("products")
        .select("products.*", "product_categories.name as category_name")
        .leftJoin("product_categories", "products.category_id", "product_categories.id");

      if (name) {
        query = query.where("products.name", "ILIKE", `%${name}%`);
      }

      if (category_id) {
        query = query.where("products.category_id", category_id);
      }

      if (min_price) {
        query = query.where("products.price", ">=", parseFloat(min_price));
      }

      if (max_price) {
        query = query.where("products.price", "<=", parseFloat(max_price));
      }

      const products = await query;

      let filteredProducts = products;

      if (category) {
        filteredProducts = products.filter((product) =>
          product.category_name?.toLowerCase().includes(category.toLowerCase())
        );
      }

      return h.response(filteredProducts);
    } catch (err) {
      console.error("Error in index:", err);
      return h
        .response({ message: "Failed to fetch products", error: err.message })
        .code(500);
    }
  }

  async show(request, h) {
    const { id } = request.params;
    const product = await db
      .table("products")
      .select("products.*", "product_categories.name as category_name")
      .leftJoin("product_categories", "products.category_id", "product_categories.id")
      .where("products.id", id)
      .first();

    if (!product) {
      return h.response({ message: "Product not found" }).code(404);
    }

    return h.response(product);
  }

  async store(request, h) {
    try {
      const { name, description, category_id, price, stock } = request.payload;
      let image = null;

      // Handle single image upload
      if (request.payload.image) {
        const uploadedImage = request.payload.image;
        const filename = `${Date.now()}-${uploadedImage.filename}`;
        const uploadPath = path.join(__dirname, "../../uploads/products", filename);

        // Ensure upload directory exists
        const uploadDir = path.dirname(uploadPath);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save file
        const fileStream = fs.createWriteStream(uploadPath);
        await new Promise((resolve, reject) => {
          uploadedImage.pipe(fileStream);
          uploadedImage.on("end", resolve);
          uploadedImage.on("error", reject);
        });

        image = `/uploads/products/${filename}`;
      }

      // Check duplicate name
      if (await Product.findByName(name)) {
        // Hapus file yang sudah diupload jika ada duplikasi
        if (image) {
          const imagePath = path.join(__dirname, "../..", image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return h.response({ message: "Product already exists" }).code(400);
      }

      // Create product
      const [newProduct] = await Product.create({
        name,
        description,
        category_id,
        price,
        stock,
        image, // Simpan hanya 1 image
      });

      return h.response(newProduct).code(201);
    } catch (err) {
      console.error("Error in store:", err);
      return h
        .response({ message: "Failed to create product", error: err.message })
        .code(500);
    }
  }

  async update(request, h) {
    const { id } = request.params;
    const { name, description, category_id, price, stock } = request.payload;

    // Get current product data first
    const currentProduct = await Product.find(id);
    if (!currentProduct) {
      return h.response({ message: "Product not found" }).code(404);
    }

    let updateData = {
      name,
      description,
      category_id,
      price,
      stock,
    };

    // Handle image upload if provided
    if (request.payload.image) {
      const uploadedImage = request.payload.image;
      const filename = `${Date.now()}-${uploadedImage.filename}`;
      const uploadPath = path.join(__dirname, "../../uploads/products", filename);

      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileStream = fs.createWriteStream(uploadPath);
      await new Promise((resolve, reject) => {
        uploadedImage.pipe(fileStream);
        uploadedImage.on("end", resolve);
        uploadedImage.on("error", reject);
      });

      // Hapus gambar lama jika ada
      if (currentProduct.image) {
        const oldImagePath = path.join(__dirname, "../..", currentProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.image = `/uploads/products/${filename}`;
    }

    const [updatedProduct] = await Product.update(id, updateData);
    return h.response(updatedProduct);
  }

  async destroy(request, h) {
    const { id } = request.params;

    // Get product first to delete associated image
    const product = await Product.find(id);
    if (!product) {
      return h.response({ message: "Product not found" }).code(404);
    }

    // Delete image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, "../..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const deleted = await Product.delete(id);
    return h.response({ message: "Product deleted successfully" });
  }
}

module.exports = new ProductController();
