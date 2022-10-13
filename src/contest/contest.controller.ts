import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateContestDTO } from './dto/request/create-contest.dto';
import { ContestService } from './contest.service';
import { CreateProblemDTO } from './dto/request/create-problem.dto';
import { GetProblemDTO } from './dto/request/get-problem.dto';
import { DeleteProblemDTO } from './dto/request/delete-problem.dto';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateUserDTO } from 'src/user/dto/request/create-user.dto';
import { User } from 'src/auth/auth.model';

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

    @Post('')
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

    @Get('problem/:contestId')
    getProblemById(@Param() dto: GetProblemDTO) {
        return this.contestservice.GetProblemsById(dto);
    }

    @Post('problem')
    createProblemById(@Body() dto: CreateProblemDTO) {
        return this.contestservice.CreateContestProblemById(dto);
    }
    @Delete('problem')
    deleteProblemById(@Body() dto: DeleteProblemDTO) {
        return this.contestservice.DeleteContestProblemById(dto);
    }
    @Delete('/:contestid')
    deleteContestById(@Param() params: {contestid: number}) {
        return this.contestservice.DeleteContest(params.contestid);
    }

    @Post('/user')
    @UseGuards(JwtAuthGuard) 
    createUser(@Body() dto:CreateUserDTO) {
        return this.contestservice.CreateUser(dto);
    }
    
    @Delete('/user/:userId')
    @UseGuards(JwtAuthGuard)
    deleteUser(@Body() dto:DeleteUserDTO) {
        return this.contestservice.DeleteUser(dto);
    }

}