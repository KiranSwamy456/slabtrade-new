import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT || 5000),

  APP_NAME: process.env.APP_NAME || "Slab Trade API",

  API_PREFIX: process.env.API_PREFIX || "/api",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  JWT_SECRET: process.env.JWT_SECRET || "change_this_secret",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
