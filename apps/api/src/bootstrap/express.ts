import express, { type Express } from "express";

export const createExpressApp = (): Express => {
  const app = express();

  // your existing middleware
  // app.use(...)

  return app;
};
