import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterResponseDto } from './dto/RegisterResponseDto';
import { ResponseEntity } from 'src/common/dto/ResponseEntity';
import { LoginResponseDto } from './dto/LoginResponseDto';
import { JWT_EXPIRES } from 'src/common/config/expireTimes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<ResponseEntity<RegisterResponseDto>> {
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });

    return {
      data: { email: user.email },
      httpStatus: HttpStatus.CREATED,
      status: true,
      message: 'User registered successfully',
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_EXPIRES.ACCESS_TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_EXPIRES.REFRESH_TOKEN_EXPIRE_TIME,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      data: {
        email: user.email,
        access_token: token,
        refresh_token: refreshToken,
      },
      httpStatus: HttpStatus.OK,
      status: true,
      message: 'User logged in successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { expiresIn: JWT_EXPIRES.ACCESS_TOKEN_EXPIRE_TIME },
      );
      const newRefreshToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { expiresIn: JWT_EXPIRES.REFRESH_TOKEN_EXPIRE_TIME },
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        data: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
