import express from "express";
import UsersController from "./user.controller.js";

const api = express.Router({
  mergeParams: true,
});

export default function UsersRoute() {
  const handler = new UsersController();

  api.route("/user/register").post((req, res) => {
    handler.createUser(req, res);
  });

  api.route("/user/login").post((req, res) => {
    handler.login(req, res);
  });

  return api;
}
