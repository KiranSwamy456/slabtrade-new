import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Slab Trade API",
      version: "1.0.0",
      description:
        "Slab Trade REST API for authentication, users, marketplace operations, and role-based access control.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication and user account APIs",
      },
      {
        name: "Health",
        description: "API health check endpoints",
      },
      {
        name: "Admin",
        description: "Administrator APIs",
      },
      {
        name: "Vendor",
        description: "Vendor APIs",
      },
      {
        name: "Customer",
        description: "Customer APIs",
      },
      {
        name: "Support",
        description: "Support APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT access token. Enter only the token value; Swagger UI will add the Bearer prefix automatically.",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Invalid or expired access token",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
              example: [],
            },
          },
        },

        ValidationError: {
          type: "object",
          properties: {
            field: {
              type: "string",
              example: "email",
            },
            message: {
              type: "string",
              example: "Invalid email address",
            },
          },
        },
      },
    },
  },

  apis: ["src/modules/**/*.ts"],
});
