import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.role.createMany({
    data: [
      {
        name: "Admin",
        description: "System Administrator",
      },
      {
        name: "Vendor",
        description: "Marketplace Vendor",
      },
      {
        name: "Customer",
        description: "Marketplace Customer",
      },
      {
        name: "Support",
        description: "Customer Support",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Roles inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
