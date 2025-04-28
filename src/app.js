import { connectMongodb } from "./db/mongo.js";
import env from "./config/env.js";
import middleware from "./middleware/index.js";
import logger from "./utils/logger.js";
import UsersRoute from "./modules/user/user.route.js";
import ProductRoute from "./modules/product/product.route.js";
import CartRoute from "./modules/cart/cart.route.js";
import { seedTesProductInDatabase } from "./db/dbSeedData.js";

const secrets = env();

const port = secrets.PORT || 5000;

const apiVersion = "v1";

(async () => {
  try {
    // Connect to MongoDB instance
    await connectMongodb();

    // Seed Data In Db
    await seedTesProductInDatabase();

    // Add routes
    middleware.addMiddleware(`/${apiVersion}`, UsersRoute());
    middleware.addMiddleware(`/${apiVersion}`, ProductRoute());
    middleware.addMiddleware(`/${apiVersion}`, CartRoute());

    // Start server
    const server = middleware.getApp().listen(port, () => {
      logger.info(`Server Running On Port: ${port}`);
    });
    server.timeout = 300000;

    // Graceful shutdown
    const shutdown = () => {
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
})();

export default middleware.getApp();
