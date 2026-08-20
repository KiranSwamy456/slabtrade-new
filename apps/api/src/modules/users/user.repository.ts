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
