import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';
import { DbModule } from 'database/database.module';

@Module({
  imports: [
        DbModule,
        ClassTransformer
  ],
  providers: [CodeService],
  controllers: [CodeController]
})
export class CodeModule {}
