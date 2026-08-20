import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "Admin",
      description: "System Administrator",
    },
    {
      name: "Manager",
      description: "Business Manager",
    },
    {
      name: "Sales",
      description: "Sales Executive",
    },
    {
      name: "Customer",
      description: "Marketplace Customer",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
