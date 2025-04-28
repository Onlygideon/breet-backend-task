import CartRepo from "./cart.repo.js";
import logger from "../../utils/logger.js";
import cacheControl from "../../services/cacheControl/index.js";

export default class CartUsecase {
  constructor() {
    this._repo = new CartRepo();
  }

  async createCart(cart) {
    try {
      const data = await this._repo.createCart(cart);

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      if (error.code === 11000) {
        return {
          success: false,
          error: `Cart already have items`,
        };
      } else {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }

  async getUserCart(userId) {
    try {
      let data = await this._repo.getUserCart(userId);
      if (!data) {
        data = await this._repo.createCart({ userId });
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

  async updateCartById(id, update) {
    try {
      const data = await this._repo.updateCartById(id, update);

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

  async deleteCartById(id) {
    try {
      await this._repo.deleteCart(id);

      return {
        success: true,
        data: "Cart Deleted Successfully!!",
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkoutCart(userId) {
    const checkoutLockKey = `checkout-lock:${userId}`;

    try {
      const checkCartLocked = await cacheControl.exists(checkoutLockKey);
      if (checkCartLocked) {
        return {
          success: false,
          error:
            "You have already attempted a checkout. Please try again after a short wait (about 20 seconds).",
        };
      }

      await cacheControl.set(checkoutLockKey, "locked", 20);

      const cart = await this.getUserCart(userId);
      if (!cart.success || cart.data.items.length === 0) {
        await cacheControl.deleteKey(checkoutLockKey);
        return {
          success: false,
          error: "Your cart is empty",
        };
      }

      const checkout = await this._repo.checkoutCartSession(cart.data.id);
      if (checkout.done) {
        return {
          success: true,
          data: "Checkout successful",
        };
      } else {
        return {
          success: false,
          error: "Checkout processing failed. Try again later",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    } finally {
      await cacheControl.deleteKey(checkoutLockKey);
    }
  }
}
