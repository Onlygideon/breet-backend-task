import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import Middleware from "./middleware.js";

import { authorize } from "./auth.js";
import { getAuthService } from "../services/auth/index.js";

let authService = getAuthService();
export const auth = authorize(authService);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "You have exceeded the 150 requests in 1 minute limit!",
  standardHeaders: true,
});

const allowedMethods = "GET,HEAD,PUT,PATCH,POST,DELETE";
const allowedHeaders =
  "Content-Type, Authorization, Origin, X-Requested-With, Accept, withCredentials, credentials, Cookie, Access-Control-Allow-Origin";

const allowedOrigins = ["http://localhost:3000"];

// Set the CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

const middleware = new Middleware(express());

async function setUpMiddlewares() {
  try {
    middleware.addMiddleware(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["'self'"],
          },
        },
        frameguard: {
          action: "DENY",
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
      })
    );

    middleware.getApp().set("trust proxy", 1);

    middleware.addMiddleware(cors(corsOptions));
    middleware.addMiddleware(limiter);

    middleware.addMiddleware(express.json({ limit: 52428800, extended: true }));
    middleware.addMiddleware(express.urlencoded({ extended: true, limit: "200mb" }));

    middleware.baseRoute();
  } catch (error) {
    console.error("Error setting up middleware:", error.message);
    throw error;
  }
}
setUpMiddlewares();

export default middleware;
