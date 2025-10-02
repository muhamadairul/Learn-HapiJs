const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  async index(request, h) {
    try {
      const { 'product.id': productId } = request.query;

      if (productId) {
        // Cari cart berdasarkan product ID
        const cartItem = await Cart.findByProductId(productId);
        return cartItem ? h.response([cartItem]) : h.response([]);
      }

      // Get semua cart items dengan data product
      const data = await Cart.getAllWithProducts();
      return h.response(data);
    } catch (err) {
      console.error("Error in cart index:", err);
      return h
        .response({ message: "Failed to fetch cart items", error: err.message })
        .code(500);
    }
  }

  async show(request, h) {
    try {
      const { id } = request.params;
      const cartItem = await Cart.findWithProduct(id);
      
      if (!cartItem) {
        return h.response({ message: "Cart item not found" }).code(404);
      }

      return h.response(cartItem);
    } catch (err) {
      console.error("Error in cart show:", err);
      return h
        .response({ message: "Failed to fetch cart item", error: err.message })
        .code(500);
    }
  }

  async store(request, h) {
    try {
      const { quantity, total_amount, product } = request.payload;

      // Validasi input
      if (!product || !product.id) {
        return h.response({ message: "Product data is required" }).code(400);
      }

      // Cek apakah product exists
      const productExists = await Product.find(product.id);
      if (!productExists) {
        return h.response({ message: "Product not found" }).code(404);
      }

      // Cek apakah product sudah ada di cart
      const existingCart = await Cart.findByProductId(product.id);
      if (existingCart) {
        return h.response({ message: "Product already in cart" }).code(400);
      }

      // Create cart item
      const [newCartItem] = await Cart.create({
        product_id: product.id,
        quantity: quantity || 1,
        total_amount: total_amount || productExists.price,
        created_at: new Date(),
        updated_at: new Date()
      });

      // Get created cart item with product data
      const cartWithProduct = await Cart.findWithProduct(newCartItem.id);
      return h.response(cartWithProduct).code(201);
    } catch (err) {
      console.error("Error in cart store:", err);
      return h
        .response({ message: "Failed to add item to cart", error: err.message })
        .code(500);
    }
  }

  async update(request, h) {
    try {
      const { id } = request.params;
      const { quantity, total_amount, product } = request.payload;

      // Cek apakah cart item exists
      const existingCart = await Cart.find(id);
      if (!existingCart) {
        return h.response({ message: "Cart item not found" }).code(404);
      }

      // Update cart item
      const updatedCart = await Cart.update(id, {
        quantity,
        total_amount,
        updated_at: new Date()
      });

      if (!updatedCart) {
        return h.response({ message: "Failed to update cart item" }).code(400);
      }

      // Get updated cart item with product data
      const cartWithProduct = await Cart.findWithProduct(id);
      return h.response(cartWithProduct);
    } catch (err) {
      console.error("Error in cart update:", err);
      return h
        .response({ message: "Failed to update cart item", error: err.message })
        .code(500);
    }
  }

  async destroy(request, h) {
    try {
      const { id } = request.params;
      
      const deleted = await Cart.delete(id);
      if (!deleted) {
        return h.response({ message: "Cart item not found" }).code(404);
      }

      return h.response({ message: "Cart item deleted successfully" });
    } catch (err) {
      console.error("Error in cart destroy:", err);
      return h
        .response({ message: "Failed to delete cart item", error: err.message })
        .code(500);
    }
  }

  async clear(request, h) {
    try {
      await Cart.clearAll();
      return h.response({ message: "Cart cleared successfully" });
    } catch (err) {
      console.error("Error in cart clear:", err);
      return h
        .response({ message: "Failed to clear cart", error: err.message })
        .code(500);
    }
  }
}

module.exports = new CartController();