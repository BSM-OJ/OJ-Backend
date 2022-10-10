import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateContestDTO } from './dto/request/create-contest.dto';
import { ContestService } from './contest.service';
import { CreateProblemDTO } from './dto/request/create-problem.dto';
import { GetProblemDTO } from './dto/request/get-problem.dto';

type idType = {
    id: number
}

type Contests = {
    before: { id: number, name: string }[],
    starting: { id: number, name: string }[],
    ended: { id: number, name: string }[],
}[]

@Controller('contest')
export class ContestController {
    constructor(private readonly contestservice: ContestService) { }

    @Post('create')
    createContest(
        @Body() dto: CreateContestDTO
    ) {
        return this.contestservice.CreateContest(dto);
    }

    @Get('before')
    getBeforeContests() {
        return this.contestservice.GetBeforeContests();
    }

    @Get('starting')
    getStartingContests() {
        return this.contestservice.GetStartingContests();
    }

    @Get('ended')
    getEndedContests() {
        return this.contestservice.GetEndedContests();
    }

    @Get('problem/:id')
    getProblemById(@Param() dto: GetProblemDTO) {
        return this.contestservice.GetProblemsById(dto);
    }

    @Post('problem')
    createProblemById(@Body() dto: CreateProblemDTO) {
        return this.contestservice.CreateContestProblemById(dto);
    }

}