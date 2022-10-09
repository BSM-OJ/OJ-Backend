import { Module } from '@nestjs/common';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';
import { DbModule } from 'database/database.module';

@Module({
  imports: [
    DbModule
  ],
  providers: [ContestService],
  controllers: [ContestController]
})
export class ContestModule {}
