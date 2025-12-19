import {
  Controller,
  Req,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TfaService } from './tfa.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ResponseEntity } from 'src/common/dto/ResponseEntity';
import { User } from '@prisma/client';
import { LoginResponseDto } from '../dto/LoginResponseDto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('2fa')
@UseGuards(JwtAuthGuard)
export class TfaController {
  constructor(private tfaService: TfaService) {}

  @Get('status')
  async getStatus(@Req() req) {
    return this.tfaService.getStatus(req.user.userId);
  }

  @Post('generate')
  async generate(@Req() req): Promise<ResponseEntity<{ qrCode: string }>> {
    return this.tfaService.generate(req.user);
  }

  @Post('turn-on')
  async turnOn(
    @Req() req,
    @Body('code') code: string,
  ): Promise<ResponseEntity<any>> {
    return this.tfaService.turnOn(req.user, code);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Public()
  async verify(
    @Body('tempToken') tempToken: string,
    @Body('code') code: string,
  ): Promise<ResponseEntity<LoginResponseDto>> {
    return this.tfaService.verify2FA(tempToken, code);
  }

  @Post('turn-off')
  async turnOff(
    @Req() req,
    @Body('code') code: string,
  ): Promise<ResponseEntity<void>> {
    return this.tfaService.turnOff(req.user, code);
  }
}
