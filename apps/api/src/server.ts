import app from "./app";
import { connectDatabase } from "./bootstrap/database";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect PostgreSQL
    await connectDatabase();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
