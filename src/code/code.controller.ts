import { Controller, Get } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller('code')
export class CodeController {
    constructor(private readonly codeService: CodeService) {}

    @Get()
    async Code(): Promise<string> {
        return await this.codeService.complie("#include<iostream> \n using namespace std; string a; int main() {cin >> a; cout << a;}");
    }
}
