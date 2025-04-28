import mongoose from "mongoose";
import CartUsecase from "./cart.usecase.js";
import ProductUsecase from "../product/product.usecase.js";
import ResponseHandler from "../../config/response.js";
import { validateAddItemsToCart } from "./cart.validate.js";

export default class CartController {
  constructor() {
    this._usecase = new CartUsecase();
    this._productUsecase = new ProductUsecase();
    this._handler = ResponseHandler;
  }

  async getUserCart(req, res, user) {
    try {
      const response = await this._usecase.getUserCart(user.id);
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.notFound(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async addItemsToCart(req, res, user) {
    try {
      const cartItems = req.body;
      const { error } = validateAddItemsToCart(cartItems);
      if (error) {
        return this._handler.badRequest(res, error.message);
      }

      const cart = (await this._usecase.getUserCart(user.id))?.data;

      const itemsCart = cart.items;

      for (const item of cartItems.items) {
        const product = await this._productUsecase.getProductById(item.productId);
        if (!product.success || !product.data) {
          return this._handler.badRequest(res, `Product with ID ${item.productId} not found`);
        }

        if (product.data.stock < item.quantity) {
          return this._handler.badRequest(
            res,
            `Insufficient Stock. ${product.data.name} has ${product.data.stock} left in stock`
          );
        }

        const itemExist = itemsCart.find((i) => i.productId.toString() === item.productId);
        const amount = product.data.price * item.quantity;
        if (itemExist) {
          itemExist.quantity = item.quantity;
          itemExist.amount = amount;
        } else {
          itemsCart.push({
            productId: item.productId,
            quantity: item.quantity,
            amount,
          });
        }
      }

      let totalAmount = 0;
      for (const item of itemsCart) {
        totalAmount += item.amount;
      }

      const response = await this._usecase.updateCartById(cart.id, {
        items: itemsCart,
        totalAmount,
      });
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.badRequest(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message);
    }
  }

  async removeItemFromCart(req, res, user) {
    try {
      const { productId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return this._handler.badRequest(res, "Invalid Product Id");
      }

      const cart = (await this._usecase.getUserCart(user.id))?.data;

      let cartItems = cart.items;

      const itemExist = cartItems.find((i) => i.productId.toString() === String(productId));
      if (!itemExist) {
        return this._handler.badRequest(
          res,
          "Product is not found in your cart. Please check and try again."
        );
      }

      cartItems = cartItems.filter((i) => i.productId.toString() !== String(productId));

      let totalAmount = 0;
      for (const item of cartItems) {
        totalAmount += item.amount;
      }

      const response = await this._usecase.updateCartById(cart.id, {
        items: cartItems,
        totalAmount,
      });
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.badRequest(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message);
    }
  }

  async checkoutUserCart(req, res, user) {
    try {
      const response = await this._usecase.checkoutCart(user.id);
      if (response.success) {
        return this._handler.success(res, response.data);
      } else {
        return this._handler.notFound(res, response.error);
      }
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }
}
