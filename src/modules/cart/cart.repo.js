import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export default class CartRepo {
  async createCart(cart) {
    try {
      const data = await Cart.findOneAndUpdate(
        { userId: cart.userId },
        { $set: cart },
        { new: true, upsert: true }
      );
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async getUserCart(userId) {
    try {
      const data = await Cart.findOne({ userId });
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async updateCartById(id, update) {
    try {
      const data = await Cart.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id) {
    try {
      await Cart.findByIdAndDelete(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  async checkoutCartSession(id) {
    const session = await Product.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findById(id);

      for (const item of cart.items) {
        const product = await Product.findOne({ _id: item.productId });
        if (product && product.isDeleted) {
          throw new Error(
            `Product: ${product.name} is no longer active. Remove from cart before checkout`
          );
        }

        const updated = await Product.updateOne(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (updated.modifiedCount === 0) {
          throw new Error(`Insufficient Stock. ${product.name} has ${product.stock} left in stock`);
        }
      }

      await Cart.deleteOne({ _id: cart._id }, { session });
      await session.commitTransaction();

      return { done: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
