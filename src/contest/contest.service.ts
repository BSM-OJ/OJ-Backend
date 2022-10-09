import { Injectable, Inject, UnprocessableEntityException} from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateContestDTO } from './dto/create-contest.dto';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { GetProblemDTO } from './dto/request/get-problem.dto';

@Injectable()
export class ContestService {
    constructor(@Inject(MD_CONNECTION) private connection: any) {}

    private conn = this.connection.pool;

    private async getId() {
        const sqlQuery = 'select id from bsmoj.contest order by id desc limit 1';
        return this.conn.query(sqlQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

    async createContest(dto: CreateContestDTO) {
        const { start_date, end_date, password, name} = dto;
        const sqlQuery = 'INSERT INTO bsmoj.contest (start_date, end_date, password, name) VALUES(?, ?, ?, ?)';
        const params = [start_date, end_date, password, name];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        const id = await this.getId();
        return id;
    }

    async getBeforeContests() {
        const beforeQuery = 'select id, name from bsmoj.contest where start_date > CURDATE()';
        const before = await this.conn.query(beforeQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return before;
    }

    async getStartingContests() {
        const startingQuery = 'select id, name from bsmoj.contest where end_date >= CURDATE() and start_date <= CURDATE()';
        const starting = await this.conn.query(startingQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return starting;
    }

    async getEndedContests() {
        const endedQuery = 'select id, name from bsmoj.contest where end_date < CURDATE()';
        const ended = await this.conn.query(endedQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return ended;
    }

    async getProblemById(dto: GetProblemDTO) {
        const { contestId } = dto;
        const query = 'select problem_id from bsmoj.contest_problem where contest_id=' + contestId;
        const problems = await this.conn.query(query, (error: string)=>{
            if(error) throw new UnprocessableEntityException();
        })
        return problems;
    }

    async createProblemById(dto: CreateProblemDTO) {
        const {problem_id, contest_id} = dto;
        const query = 'insert into bsmoj.contest_problem (problem_id, contest_id) values(?,?)';
        const params = [problem_id, contest_id];
        await this.conn.query(query, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

}
