import { Controller, Get, Body, Post, Inject, UseGuards, Param } from '@nestjs/common';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CodeService } from './code.service';
import { ComplieResultDTO } from './dto/compile-result.dto';
import { RunDTO } from './dto/request/run.dto';
import { SubmitDTO } from './dto/request/submit.dto';
import { RightAnswerDTO } from './dto/right-answer.dto';
import { WrongAnswerDTO } from './dto/wrong-answer.dto';

@UseGuards(JwtAuthGuard)
@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Post('complie')
    async code(@Body() dto: RunDTO): Promise<ComplieResultDTO> {
        return await this.codeService.Complie(dto);
    }

    @Post('submit')
    async submit(@GetUser() user: User, @Body() dto: SubmitDTO): Promise<WrongAnswerDTO | RightAnswerDTO> {
        return this.codeService.Submit(user, dto);
    }
}
