import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("Cet e-mail est déjà utilisé");
    }

    const password = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.usersService.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase(),
      password,
    });

    const payload = {
      sub: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
