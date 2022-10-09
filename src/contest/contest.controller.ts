import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateContestDTO } from './dto/create-contest.dto';
import { ContestService } from './contest.service';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { GetProblemDTO } from './dto/request/get-problem.dto';

type idType = {
    id: number
}

type Contests = {
    before: {id:number,name:string}[],
    starting: {id:number,name:string}[],
    ended: {id:number,name:string}[],
}[]

@Controller('contest')
export class ContestController {
    constructor(private readonly contestservice: ContestService) { }

    @Post('create')
    createContest(
        @Body() dto: CreateContestDTO
    ) {
        return this.contestservice.createContest(dto);
    }
    
    @Get('before')
    getBeforeContests(){
        return this.contestservice.getBeforeContests()
    }

    @Get('starting')
    getStartingContests(){
        return this.contestservice.getStartingContests()
    }

    @Get('ended')
    getEndedContests(){
        return this.contestservice.getEndedContests()
    }

    @Get('problem/:id')
    getProblemById(@Param() dto: GetProblemDTO) {
        return this.contestservice.getProblemById(dto)
    }

    @Post('problem')
    createProblemById(@Body() dto: CreateProblemDTO) {
        return this.contestservice.createProblemById(dto);
    }

}