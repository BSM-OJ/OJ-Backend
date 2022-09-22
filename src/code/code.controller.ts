import { Controller, Get, Body, Post, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CodeService } from './code.service';
import { ComplieResultDTO } from './dto/compile-result.dto';
import { RunDTO } from './dto/run.dto';

@UseGuards(JwtAuthGuard)
@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Post('complie')
    async Code(@Body() dto: RunDTO): Promise<ComplieResultDTO> {
        return await this.codeService.complie(dto);
    }

    // @Post('submit/:ProblemId')
}
