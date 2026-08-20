import { prisma } from "@database/prisma";

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    throw error;
  }
}
