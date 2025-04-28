import express from "express";
import CartController from "./cart.controller.js";
import { auth } from "../../middleware/index.js";

const api = express.Router({
  mergeParams: true,
});

export default function CartRoute() {
  const handler = new CartController();

  api.route("/cart/user").get(auth, (req, res) => {
    handler.getUserCart(req, res, req.user);
  });

  api.route("/cart/user/add").put(auth, (req, res) => {
    handler.addItemsToCart(req, res, req.user);
  });

  api.route("/cart/user/remove/:productId").put(auth, (req, res) => {
    handler.removeItemFromCart(req, res, req.user);
  });

  api.route("/cart/user/checkout").post(auth, (req, res) => {
    handler.checkoutUserCart(req, res, req.user);
  });

  return api;
}
