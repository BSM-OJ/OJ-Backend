import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemModule } from './problem/problem.module';
import { UserModule } from './user/user.module';
import { ContestModule } from './contest/contest.module';
import { CodeModule } from './code/code.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/entities/*.entity.{js,ts}']
    }),
    ProblemModule, 
    UserModule, 
    ContestModule, 
    CodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
