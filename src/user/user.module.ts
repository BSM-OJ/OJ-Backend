import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClassTransformer } from '@nestjs/class-transformer';
import { DbModule } from 'database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DbModule,
    ClassTransformer,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
