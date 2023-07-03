import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ where: { username: createUserDto.username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    createUserDto.password = await this.generatePWhash(createUserDto.password);
    // Create the user in the database
    const user = await this.userModel.create(createUserDto);

    return this.generateAccessToken(user);

  }

  async generatePWhash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ where: { username: loginUserDto.username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAccessToken(user);
  }

  private generateAccessToken(user: User) {
    // Generate JWT token
    const token = this.jwtService.sign({ userId: user.id });
    return { token, user };
  }

  async validateUserById(userId: number): Promise<User | null> {
    // Find the user in the database by ID
    const user = await User.findByPk(userId);
    return user || null;
  }
}
