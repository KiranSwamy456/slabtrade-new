import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import pinoHttp from "pino-http";

import { logger } from "@common/logger";

export const registerMiddlewares = (app: Express): void => {
  app.use(cors());

  app.use(helmet());

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(morgan("dev"));

  app.use(
    pinoHttp({
      logger,
    }),
  );
};
