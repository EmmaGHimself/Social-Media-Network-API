import { Controller, Post, Body, UsePipes, HttpCode, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody} from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @UsePipes(new ValidationPipe())
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  @UsePipes(new ValidationPipe())
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
