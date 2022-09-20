import { Module } from '@nestjs/common';
import { ProblemModule } from './problem/problem.module';
import { UserModule } from './user/user.module';
import { ContestModule } from './contest/contest.module';
import { CodeModule } from './code/code.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ProblemModule, 
    UserModule, 
    ContestModule, 
    CodeModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
