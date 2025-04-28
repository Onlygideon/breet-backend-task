import ProductRepo from "./product.repo.js";
import logger from "../../utils/logger.js";

export default class ProductUsecase {
  constructor() {
    this._repo = new ProductRepo();
  }

  async createProduct(product) {
    try {
      const data = await this._repo.createProduct(product);

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getProductById(id) {
    try {
      let data = await this._repo.getProductById(id);

      if (!data) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserProducts(userId) {
    try {
      let data = await this._repo.getUserProducts(userId);

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getAllProducts() {
    try {
      let data = await this._repo.getAllProducts();

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updateProductById(id, update) {
    try {
      const data = await this._repo.updateProductById(id, update);

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteProductById(id) {
    try {
      await this._repo.deleteProductById(id);

      return {
        success: true,
        data: "Product Deleted Successfully!!",
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
