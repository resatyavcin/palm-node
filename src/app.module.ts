import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected/protected.module';

@Module({
  imports: [PrismaModule, AuthModule, ProtectedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
