import Product from "./product.model.js";

export default class ProductRepo {
  async createProduct(product) {
    try {
      const data = await Product.create(product);
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const data = await Product.findOne({ _id: id, isDeleted: false });
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async getUserProducts(userId) {
    try {
      const data = await Product.find({ userId, isDeleted: false });
      return data.length > 0 ? data.map((item) => item.toJSON()) : [];
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const data = await Product.find({ isDeleted: false });
      return data.length > 0 ? data.map((item) => item.toJSON()) : [];
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, update) {
    try {
      const data = await Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: update },
        { new: true }
      );
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const data = await Product.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      );
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }
}
