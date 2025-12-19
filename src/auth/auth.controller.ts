import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

//dtos
import { LoginDto } from './dto/LoginRequestDto';
import { RegisterDto } from './dto/RegisterRequestDto';
import { RegisterResponseDto } from './dto/RegisterResponseDto';
import { LoginResponseDto } from './dto/LoginResponseDto';
import { ResponseEntity } from 'src/common/dto/ResponseEntity';
import { RefreshResponseDto } from './dto/RefreshResponseDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() dto: RegisterDto,
  ): Promise<ResponseEntity<RegisterResponseDto>> {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<ResponseEntity<LoginResponseDto>> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req): Promise<ResponseEntity<RefreshResponseDto>> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.refreshToken(token);
  }
}
