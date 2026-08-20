import { env } from "./env";

export const appConfig = {
  name: env.APP_NAME,
  env: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
};
