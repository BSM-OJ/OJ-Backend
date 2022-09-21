import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClassTransformer } from '@nestjs/class-transformer';
import { DbModule } from 'database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [
    DbModule,
    ClassTransformer,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  providers: [UserService, AuthService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
