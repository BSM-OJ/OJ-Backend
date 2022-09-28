import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { DbModule } from 'database/database.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
        DbModule,
        ClassTransformer,
        UserModule,
        AuthModule,
        JwtModule
  ],
  providers: [CodeService, UserService, AuthService],
  controllers: [CodeController]
})
export class CodeModule {}
