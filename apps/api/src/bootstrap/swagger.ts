import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@swagger/swagger";

export const registerSwagger = (app: Express): void => {
  // JSON endpoint
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        url: "/api-docs.json",
      },
    }),
  );
};
