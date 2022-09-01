import { Controller, Get, Body, Post, Inject } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CodeService } from './code.service';
import { RunDTO } from './dto/run.dto';


@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService, @Inject(MD_CONNECTION) private conn: any) {}

    @Post()
    async Code(@Body() dto: RunDTO): Promise<string> {
        return await this.codeService.complie(dto);
    }

    @Get()
    async connTest() {
        try {
            const result = await this.conn.pool.query("SELECT 1 as val");
            return result;
        } catch (err) {
            throw err;
        }
    }
}
