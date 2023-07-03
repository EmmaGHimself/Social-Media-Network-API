import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from '../controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { User } from '../models/user.model';
require('dotenv').config();

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
