const db = require("../../config/db");
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const {
  createProductDataSchema,
  updateProductDataSchema,
} = require("../validations/productValidation");

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
    let image = null;

    try {
      const { name, description, category_id, price, stock } = request.payload;

      const { error } = createProductDataSchema.validate({
        name,
        description,
        category_id,
        price,
        stock,
      });

      if (error) {
        return h
          .response({
            status: "error",
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
          })
          .code(400);
      }

      if (request.payload.image) {
        const uploadedImage = request.payload.image;

        const contentType =
          uploadedImage.headers?.["content-type"] ||
          uploadedImage.hapi?.headers?.["content-type"];

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

        if (!contentType || !allowedMimeTypes.includes(contentType)) {
          return h
            .response({
              status: "error",
              message: "Invalid file type",
              error: `Only image files are allowed. Received: ${contentType}`,
            })
            .code(400);
        }

        const originalName = uploadedImage.filename || "image";
        let fileExtension = path.extname(originalName).replace(".", "");

        // Kalau tidak ada extension di filename → ambil dari content-type
        if (!fileExtension) {
          fileExtension = mime.extension(contentType) || "jpg";
        }

        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExtension}`;
        const uploadPath = path.join(__dirname, "../../uploads/products", filename);

        const uploadDir = path.dirname(uploadPath);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        try {
          const fileStream = fs.createWriteStream(uploadPath);

          await new Promise((resolve, reject) => {
            uploadedImage.pipe(fileStream);
            uploadedImage.on("end", resolve);
            uploadedImage.on("error", (err) => {
              if (fs.existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath);
              }
              reject(err);
            });
            fileStream.on("error", (err) => {
              if (fs.existsSync(uploadPath)) {
                fs.unlinkSync(uploadPath);
              }
              reject(err);
            });
          });

          image = `/uploads/products/${filename}`;
          console.log("Image saved successfully:", image);
        } catch (fileError) {
          console.error("Error saving file:", fileError);
          return h
            .response({
              status: "error",
              message: "Failed to save image file",
              error: fileError.message,
            })
            .code(500);
        }
      }

      const existingProduct = await Product.findByName(name);
      if (existingProduct) {
        if (image) {
          const imagePath = path.join(__dirname, "../..", image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return h
          .response({
            status: "error",
            message: "Product with this name already exists",
          })
          .code(400);
      }

      const categoryExists = await ProductCategory.find(category_id);
      if (!categoryExists) {
        if (image) {
          const imagePath = path.join(__dirname, "../..", image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        return h
          .response({
            status: "error",
            message: "Category not found",
          })
          .code(400);
      }

      const [newProduct] = await Product.create({
        name: name.trim(),
        description: description ? description.trim() : null,
        category_id,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
      });

      const productWithCategory = {
        ...newProduct,
        category_name: categoryExists.name,
      };

      return h
        .response({
          status: "success",
          message: "Product created successfully",
          data: productWithCategory,
        })
        .code(201);
    } catch (err) {
      console.error("Error in store:", err);

      if (image) {
        try {
          const imagePath = path.join(__dirname, "../..", image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up image:", cleanupError);
        }
      }

      return h
        .response({
          status: "error",
          message: "Failed to create product",
          error: err.message,
        })
        .code(500);
    }
  }

  async update(request, h) {
    const { id } = request.params;
    const { name, description, category_id, price, stock } = request.payload;

    const { error } = updateProductDataSchema.validate({
      name,
      description,
      category_id,
      price,
      stock,
    });

    if (error) {
      return h
        .response({
          status: "error",
          message: "Validation failed",
          errors: error.details.map((detail) => detail.message),
        })
        .code(400);
    }

    const currentProduct = await Product.find(id);
    if (!currentProduct) {
      return h.response({ status: "error", message: "Product not found" }).code(404);
    }

    let updateData = {
      name,
      description,
      category_id,
      price,
      stock,
    };

    if (request.payload.image) {
      const uploadedImage = request.payload.image;

      const contentType =
        uploadedImage.headers?.["content-type"] ||
        uploadedImage.hapi?.headers?.["content-type"];

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      if (!contentType || !allowedMimeTypes.includes(contentType)) {
        return h
          .response({
            status: "error",
            message: "Invalid file type",
            error: `Only image files are allowed. Received: ${contentType}`,
          })
          .code(400);
      }

      const originalName = uploadedImage.filename || "image";
      let fileExtension = path.extname(originalName).replace(".", "");

      if (!fileExtension) {
        fileExtension = mime.extension(contentType) || "jpg";
      }

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExtension}`;
      const uploadPath = path.join(__dirname, "../../uploads/products", filename);

      const uploadDir = path.dirname(uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      try {
        const fileStream = fs.createWriteStream(uploadPath);

        await new Promise((resolve, reject) => {
          uploadedImage.pipe(fileStream);
          uploadedImage.on("end", resolve);
          uploadedImage.on("error", (err) => {
            if (fs.existsSync(uploadPath)) {
              fs.unlinkSync(uploadPath);
            }
            reject(err);
          });
          fileStream.on("error", (err) => {
            if (fs.existsSync(uploadPath)) {
              fs.unlinkSync(uploadPath);
            }
            reject(err);
          });
        });

        if (currentProduct.image) {
          const oldImagePath = path.join(__dirname, "../..", currentProduct.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        updateData.image = `/uploads/products/${filename}`;
      } catch (fileError) {
        console.error("Error saving file:", fileError);
        return h
          .response({
            status: "error",
            message: "Failed to save new image",
            error: fileError.message,
          })
          .code(500);
      }
    }

    const [updatedProduct] = await Product.update(id, updateData);

    const categoryExists = await ProductCategory.find(updatedProduct.category_id);
    const productWithCategory = {
      ...updatedProduct,
      category_name: categoryExists ? categoryExists.name : null,
    };

    return h
      .response({
        status: "success",
        message: "Product updated successfully",
        data: productWithCategory,
      })
      .code(200);
  }

  async destroy(request, h) {
    const { id } = request.params;

    const product = await Product.find(id);
    if (!product) {
      return h.response({ message: "Product not found" }).code(404);
    }

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
