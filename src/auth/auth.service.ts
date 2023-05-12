import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already registered. Please login.', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create({ email, password: hashedPassword, role });
    return user;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await this.comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({ email: user.email, role: user.role });
    return { token };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await this.comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
