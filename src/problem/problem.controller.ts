import { Controller, Get, Post } from '@nestjs/common';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
    constructor(private readonly problemservice: ProblemService) {}
    
    @Get()
    viewProblem() {
        return this.problemservice.ViewProblem();
    }

    @Post()
    uploadProblem() {
        return this.problemservice.UploadProblem();
    }
}
