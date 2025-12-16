import { Module } from '@nestjs/common';
import { ProtectedService } from './protected.service';
import { ProtectedController } from './protected.controller';

@Module({
  providers: [ProtectedService],
  controllers: [ProtectedController]
})
export class ProtectedModule {}
