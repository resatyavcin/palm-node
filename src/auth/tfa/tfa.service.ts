import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { AuthService } from '../auth.service';
import { LoginResponseDto } from '../dto/LoginResponseDto';
import { ResponseEntity } from 'src/common/dto/ResponseEntity';
import * as crypto from 'crypto';

@Injectable()
export class TfaService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  private usedTempTokens = new Map<string, number>();

  static generateSecret() {
    return authenticator.generateSecret();
  }

  static async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  static getOtpAuthUrl(userEmail: string, secret: string) {
    return authenticator.keyuri(userEmail, process.env.OTP_APP_NAME, secret);
  }

  static verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }

  static generateRecoveryCodes(count: number = 8): string[] {
    return Array.from({ length: count }, () => {
      return crypto.randomBytes(4).toString('hex').toUpperCase();
    });
  }

  static hashRecoveryCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  static hashRecoveryCodes(codes: string[]): string[] {
    return codes.map((code) => this.hashRecoveryCode(code));
  }

  static verifyRecoveryCode(
    code: string,
    hashedCodes: string[],
  ): { isValid: boolean; remainingCodes: string[] } {
    const hashedCode = this.hashRecoveryCode(code);
    const index = hashedCodes.indexOf(hashedCode);

    if (index === -1) {
      return { isValid: false, remainingCodes: hashedCodes };
    }

    const remainingCodes = hashedCodes.filter((_, i) => i !== index);
    return { isValid: true, remainingCodes };
  }

  private markTempTokenAsUsed(tempToken: string): void {
    this.usedTempTokens.set(tempToken, Date.now());
    setTimeout(
      () => {
        this.usedTempTokens.delete(tempToken);
      },
      5 * 60 * 1000,
    );
  }

  async verify2FA(
    tempToken: string,
    code: string,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    if (this.usedTempTokens.has(tempToken)) {
      throw new UnauthorizedException('Token already used');
    }
    const payload = await this.jwtService.verifyAsync(tempToken);
    this.markTempTokenAsUsed(tempToken);

    if (payload.type !== '2fa-pending') {
      throw new UnauthorizedException('Invalid token');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!dbUser || !dbUser.isTwoFactorEnabled) {
      throw new UnauthorizedException('Invalid request');
    }

    let isValid = TfaService.verifyCode(code, dbUser.twoFactorSecret);
    let remainingRecoveryCodes = dbUser.recoveryCodes
      ? JSON.parse(dbUser.recoveryCodes)
      : [];

    if (!isValid && dbUser.recoveryCodes) {
      const recoveryResult = TfaService.verifyRecoveryCode(
        code,
        JSON.parse(dbUser.recoveryCodes),
      );
      isValid = recoveryResult.isValid;
      remainingRecoveryCodes = recoveryResult.remainingCodes;
    }

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    if (
      remainingRecoveryCodes.length !==
      (dbUser.recoveryCodes ? JSON.parse(dbUser.recoveryCodes).length : 0)
    ) {
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: {
          recoveryCodes:
            remainingRecoveryCodes.length > 0
              ? JSON.stringify(remainingRecoveryCodes)
              : null,
        },
      });
    }

    const { token, refreshToken } =
      await this.authService.generateTokens(dbUser);

    await this.prisma.user.update({
      where: { id: dbUser.id },
      data: { refreshToken },
    });

    return {
      data: {
        email: dbUser.email,
        access_token: token,
        refresh_token: refreshToken,
        requires2FA: dbUser.isTwoFactorEnabled,
      },
      status: true,
      message: 'User logged in successfully',
    };
  }

  async turnOn(user: { userId: string; email: string }, code: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });
    if (!dbUser) throw new NotFoundException('User not found');

    if (dbUser.isTwoFactorEnabled) {
      throw new BadRequestException(
        'Two factor authentication is already enabled',
      );
    }

    const isValid = TfaService.verifyCode(code, dbUser.twoFactorSecret);

    if (!isValid) throw new UnauthorizedException('Invalid code');

    const recoveryCodes = TfaService.generateRecoveryCodes(8);
    const hashedRecoveryCodes = TfaService.hashRecoveryCodes(recoveryCodes);

    await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        isTwoFactorEnabled: true,
        recoveryCodes: JSON.stringify(hashedRecoveryCodes),
      },
    });

    return {
      data: {
        recoveryCodes,
      },
      status: true,
      message: 'Two factor authentication turned on successfully',
    };
  }

  async generate(user: { userId: string; email: string }) {
    try {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { isTwoFactorEnabled: true },
      });

      if (dbUser?.isTwoFactorEnabled) {
        throw new BadRequestException(
          'Two factor authentication is already enabled',
        );
      }

      const secret = TfaService.generateSecret();
      const otpAuthUrl = TfaService.getOtpAuthUrl(user.email, secret);

      await this.prisma.user.update({
        where: { id: user.userId },
        data: { twoFactorSecret: secret },
      });

      const qrCode = await TfaService.generateQrCodeDataURL(otpAuthUrl);

      return {
        qrCode,
        status: true,
        message: 'Two factor authentication generated successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getStatus(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        data: {
          email: user.email,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        },
        status: true,
        message: 'Auth status retrieved successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async turnOff(user: { userId: string; email: string }, code: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) throw new NotFoundException('User not found');

    if (!dbUser.isTwoFactorEnabled) {
      throw new BadRequestException('Two factor authentication is not enabled');
    }

    let isValid = TfaService.verifyCode(code, dbUser.twoFactorSecret);
    let remainingRecoveryCodes = dbUser.recoveryCodes
      ? JSON.parse(dbUser.recoveryCodes)
      : [];

    if (!isValid && dbUser.recoveryCodes) {
      const recoveryResult = TfaService.verifyRecoveryCode(
        code,
        JSON.parse(dbUser.recoveryCodes),
      );
      isValid = recoveryResult.isValid;
      remainingRecoveryCodes = recoveryResult.remainingCodes;
    }

    if (!isValid) throw new UnauthorizedException('Invalid code');

    await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
        recoveryCodes: null,
      },
    });

    return {
      status: true,
      message: 'Two factor authentication turned off successfully',
    };
  }
}
