import { Module } from '@nestjs/common';
import { DbModule } from 'database/database.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    DbModule
  ],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
