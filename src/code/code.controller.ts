import { Controller, Get, Body, Post, Inject } from '@nestjs/common';
import { CodeService } from './code.service';
import { RunDTO } from './dto/run.dto';


@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Post()
    async Code(@Body() dto: RunDTO): Promise<string> {
        return await this.codeService.complie(dto);
    }

    @Get()
    async connTest() {
        return await this.codeService.connTest();
        
    }
}
