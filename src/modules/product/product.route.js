import express from "express";
import ProductController from "./product.controller.js";
import { auth } from "../../middleware/index.js";

const api = express.Router({
  mergeParams: true,
});

export default function ProductRoute() {
  const handler = new ProductController();

  api.route("/product").post(auth, (req, res) => {
    handler.createProduct(req, res, req.user);
  });

  api.route("/product/user").get(auth, (req, res) => {
    handler.getUserProducts(req, res, req.user);
  });

  api.route("/product/all").get((req, res) => {
    handler.getAllProducts(req, res);
  });

  api
    .route("/product/:id")
    .get((req, res) => {
      handler.getProductById(req, res);
    })
    .put(auth, (req, res) => {
      handler.updateProductById(req, res, req.user);
    })
    .delete(auth, (req, res) => {
      handler.deleteProductById(req, res, req.user);
    });

  return api;
}
