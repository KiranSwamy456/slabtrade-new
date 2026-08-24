import { AppError } from "@common/errors/AppError";
import { hashPassword } from "@common/utils/bcrypt";

import { UserRepository } from "./user.repository";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    const users = await this.userRepository.findAll();

    return users.map((user) => ({
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
    }));
  }

  async updateStatus(id: string, isActive: boolean) {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const user = await this.userRepository.updateStatus(id, isActive);

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

  async createUser(data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
    role: "Customer" | "Vendor" | "Support" | "Admin";
  }) {
    const existingUser = await this.userRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    if (data.phone) {
      const existingPhone = await this.userRepository.findByPhone(data.phone);

      if (existingPhone) {
        throw new AppError("Phone number already registered", 409);
      }
    }

    const role = await this.userRepository.findRoleByName(data.role);

    if (!role) {
      throw new AppError(`${data.role} role not found`, 404);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      roleId: role.id,
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
}
