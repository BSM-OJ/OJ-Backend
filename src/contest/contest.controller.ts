import { Controller, Post, Body } from '@nestjs/common';
import { CreateContestDTO } from './dto/create-contest.dto';
import { ContestService } from './contest.service';


@Controller('contest')
export class ContestController {
    constructor(private readonly contestservice: ContestService) { }
    @Post('createContest')
    createContest(
        @Body() dto: CreateContestDTO)
        : Promise<string> {
            return this.contestservice.CreateContest(dto);
        }
}