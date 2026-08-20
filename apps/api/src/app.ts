import { registerMiddlewares } from "@bootstrap/middleware";
import { registerRoutes } from "@bootstrap/routes";
import { registerSwagger } from "@bootstrap/swagger";

import { errorHandler } from "@common/middlewares/errorHandler";
import { createExpressApp } from "./bootstrap";

export const app = createExpressApp();

registerMiddlewares(app);

registerRoutes(app);

registerSwagger(app);

app.use(errorHandler);

export default app;
