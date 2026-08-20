import { AuthRepository } from "./auth.repository";

import { comparePassword, hashPassword } from "@common/utils/bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@common/utils/jwt";

import { AppError } from "@common/errors/AppError";
import { randomUUID } from "crypto";

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: {
    firstName: string;
    lastName?: string;
    fullName?: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const customerRole = await this.authRepository.findRoleByName("Customer");

    if (!customerRole) {
      throw new AppError("Customer role not found", 500);
    }

    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassword,
      roleId: customerRole.id,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("User account is inactive", 403);
    }

    const passwordValid = await comparePassword(password, user.password);

    if (!passwordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role?.name,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    const familyId = randomUUID();

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      familyId,
      expiresAt: refreshTokenExpiresAt,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        isVerified: user.isVerified,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const storedRefreshToken =
      await this.authRepository.findRefreshToken(refreshToken);

    if (!storedRefreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Check database expiration
    if (storedRefreshToken.expiresAt < new Date()) {
      await this.authRepository.deleteRefreshToken(refreshToken);

      throw new AppError("Refresh token expired", 401);
    }

    // Verify that the refresh token is a valid JWT
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      await this.authRepository.deleteRefreshToken(refreshToken);

      throw new AppError("Invalid refresh token", 401);
    }

    // Make sure the user still exists and is active
    const user = storedRefreshToken.user;

    if (!user || !user.isActive) {
      await this.authRepository.deleteRefreshToken(refreshToken);

      throw new AppError("User account is inactive", 401);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role?.name,
    });

    // Generate rotated refresh token
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    /*
     * Refresh Token Rotation
     *
     * The old token is removed and a new token is created
     * using the SAME familyId.
     */
    await this.authRepository.deleteRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      familyId: storedRefreshToken.familyId,
      expiresAt: refreshTokenExpiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await this.authRepository.deleteRefreshToken(refreshToken);

    return {
      message: "Logged out successfully",
    };
  }

  async getProfile(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      isActive: user.isActive,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
