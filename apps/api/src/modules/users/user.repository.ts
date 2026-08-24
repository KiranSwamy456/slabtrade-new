import { prisma } from "@database/prisma";

export class UserRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });
  }

  async findByPhone(phone: string) {
    return prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        role: true,
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
      include: {
        role: true,
      },
    });
  }

  async findRoleByName(name: string) {
    return prisma.role.findUnique({
      where: {
        name,
      },
    });
  }

  async createUser(data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
    roleId: string;
  }) {
    return prisma.user.create({
      data,
      include: {
        role: true,
      },
    });
  }
}
