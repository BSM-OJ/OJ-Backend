import { Controller, Get, Body, Post, Inject, UseGuards, Param } from '@nestjs/common';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/getUser.decorator';
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

//     @Post('solved/:problemId')
//     solved_problem(@GetUser() user: User, @Param('problemId') problemId: number) {
//         return this.codeService.solved(user, problemId);
//     }
}
