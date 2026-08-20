import { prisma } from "@database/prisma";

export class AuthRepository {
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

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
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
    fullName?: string;
    email: string;
    phone?: string;
    password: string;
    roleId?: string;
  }) {
    return prisma.user.create({
      data,
      include: {
        role: true,
      },
    });
  }
  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createRefreshToken(data: {
    token: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async revokeRefreshToken(token: string, replacedByToken?: string) {
    return prisma.refreshToken.update({
      where: {
        token,
      },
      data: {
        revokedAt: new Date(),
        replacedByToken,
      },
    });
  }

  async revokeTokenFamily(familyId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  }

  async deleteUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
