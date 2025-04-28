import mongoose from "mongoose";
import ProductUsecase from "./product.usecase.js";
import ResponseHandler from "../../config/response.js";
import { validateCreateProduct, validateUpdateProduct } from "./product.validate.js";

export default class ProductController {
  constructor() {
    this._usecase = new ProductUsecase();
    this._handler = ResponseHandler;
  }

  async createProduct(req, res, user) {
    try {
      if (user.userType !== "business") {
        return this._handler.unauthorized(
          res,
          "Unauthorized to create product - For Businesses Only"
        );
      }

      const productDetails = req.body;
      const { error } = validateCreateProduct(productDetails);
      if (error) {
        return this._handler.badRequest(res, error.message);
      }

      productDetails.userId = user.id;

      const response = await this._usecase.createProduct(productDetails);

      if (response.success) {
        return this._handler.created(res, response.data);
      } else {
        return this._handler.badRequest(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return this._handler.badRequest(res, "Invalid Product Id");
      }

      const resp = await this._usecase.getProductById(id);
      if (resp.success) {
        return this._handler.success(res, resp.data);
      } else {
        return this._handler.notFound(res, resp.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async getUserProducts(req, res, user) {
    try {
      const response = await this._usecase.getUserProducts(user.id);
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.notFound(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async getAllProducts(req, res) {
    try {
      const resp = await this._usecase.getAllProducts();
      if (resp.success) {
        return this._handler.success(res, resp.data);
      } else {
        return this._handler.notFound(res, resp.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async updateProductById(req, res, user) {
    try {
      if (user.userType !== "business") {
        return this._handler.unauthorized(
          res,
          "Unauthorized to update product - For Businesses Only"
        );
      }

      const productUpdate = req.body;
      const { error } = validateUpdateProduct(productUpdate);
      if (error) {
        return this._handler.badRequest(res, error.message);
      }

      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return this._handler.badRequest(res, "Invalid Product Id");
      }

      const product = await this._usecase.getProductById(id);
      if (!product.success || !product.data) {
        return this._handler.badRequest(res, "Product not found");
      }

      const isProductOwner =
        product.data?.userId && user.id.equals(mongoose.Types.ObjectId(product.data?.userId));
      if (!isProductOwner) {
        return this._handler.unauthorized(res, "Unauthorized to update another user product");
      }

      const response = await this._usecase.updateProductById(id, productUpdate);
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.badRequest(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message);
    }
  }

  async deleteProductById(req, res, user) {
    try {
      if (user.userType !== "business") {
        return this._handler.unauthorized(
          res,
          "Unauthorized to delete product - For Businesses Only"
        );
      }

      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return this._handler.badRequest(res, "Invalid Product Id");
      }

      const product = await this._usecase.getProductById(id);
      if (!product.success || !product.data) {
        return this._handler.badRequest(res, "Product not found");
      }

      const isProductOwner =
        product.data?.userId && user.id.equals(mongoose.Types.ObjectId(product.data?.userId));
      if (!isProductOwner) {
        return this._handler.unauthorized(res, "Unauthorized to delete another user product");
      }

      const response = await this._usecase.deleteProductById(id);
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.badRequest(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message);
    }
  }
}
