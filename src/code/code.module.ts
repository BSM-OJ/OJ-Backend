import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTransformer } from '@nestjs/class-transformer';

@Module({
  imports: [
        TypeOrmModule.forFeature([]),
        ClassTransformer
  ],
  providers: [CodeService],
  controllers: [CodeController]
})
export class CodeModule {}
