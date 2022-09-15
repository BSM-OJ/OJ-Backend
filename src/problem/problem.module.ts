import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { DbModule } from 'database/database.module';
import { ClassTransformer } from '@nestjs/class-transformer';

@Module({
    imports: [
        DbModule,
        ClassTransformer
    ],
    controllers: [
        ProblemController,
    ],
    providers: [ProblemService]
})
export class ProblemModule {}
