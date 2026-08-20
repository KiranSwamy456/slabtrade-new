import { AppError } from "@common/errors/AppError";
import { hashPassword } from "@common/utils/bcrypt";
import { AuthRepository } from "../auth/auth.repository";

export class AdminService {
  private readonly authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async createUser(data: {
    firstName: string;
    lastName?: string;
    fullName?: string;
    email: string;
    phone?: string;
    password: string;
    roleId: string;
  }) {
    // 1. Check whether email already exists
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // 2. Make sure the selected role exists
    const role = await this.authRepository.findRoleById(data.roleId);

    if (!role) {
      throw new AppError("Selected role not found", 404);
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(data.password);

    // 4. Create user
    const user = await this.authRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      roleId: data.roleId,
    });

    // 5. Never return password
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
