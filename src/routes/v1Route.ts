import express from "express";
import { AuthRoutes } from "../modules/auth/controllers";
import { ProductsRoutes } from "../modules/product/product.controller";
import { CartRoutes } from "../modules/cart/cart.controller";
import { OrderRoutes } from "../modules/order/order.controller";
import { OverviewRoutes } from "../modules/overview/overview.controller";
import { UserRoutes } from "../modules/users/users.controllers";

const v1Api = express.Router();

const authRoutes = new AuthRoutes();
const productsRoutes = new ProductsRoutes();
const cartRoutes = new CartRoutes();
const orderRoutes = new OrderRoutes();
const overviewRoutes = new OverviewRoutes();
const userRoutes = new UserRoutes();

v1Api.use("/v1", authRoutes.getRoutes());
v1Api.use("/v1", productsRoutes.getRoutes());
v1Api.use("/v1", cartRoutes.getRoutes());
v1Api.use("/v1", overviewRoutes.getRoutes());
v1Api.use("/v1", orderRoutes.getRoutes());
v1Api.use("/v1", userRoutes.getRoutes());

export default v1Api;
