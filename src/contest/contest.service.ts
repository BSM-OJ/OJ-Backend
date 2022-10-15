import { Injectable, Inject, UnprocessableEntityException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateContestDTO } from './dto/request/create-contest.dto';
import { CreateProblemDTO } from './dto/request/create-problem.dto';
import { GetProblemDTO } from './dto/request/get-problem.dto';

@Injectable()
export class ContestService {
    constructor(@Inject(MD_CONNECTION) private connection: any) { }

    private conn = this.connection.pool;

    private async GetLastId() {
        const sqlQuerySelect = 'SELECT id FROM bsmoj.contest ';
        const sqlQueryOrder = 'ORDER BY id DESC LIMIT 1';
        const sqlQuery = sqlQuerySelect + sqlQueryOrder;
        return this.conn.query(sqlQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

    // Todo:: 비밀번호 암호화
    async CreateContest(dto: CreateContestDTO) {
        const { start_date, end_date, password, name } = dto;
        const sqlQuery = 'INSERT INTO bsmoj.contest (start_date, end_date, password, name) VALUES(?, ?, ?, ?)';
        const params = [start_date, end_date, password, name];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        const id = await this.GetLastId();
        return id;
    }

    async GetBeforeContests() {
        const sqlQuerySelect = 'SELECT id, name FROM bsmoj.contest ';
        const sqlQueryWhere = 'WHERE start_date > CURDATE()';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const beforeContest = await this.conn.query(sqlQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return beforeContest;
    }

    async GetStartingContests() {
        const sqlQuerySelect = 'SELECT id, name FROM bsmoj.contest ';
        const sqlQueryWhere = 'WHERE end_date >= CURDATE() and start_date <= CURDATE()';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const startingContest = await this.conn.query(sqlQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return startingContest;
    }

    async GetEndedContests() {
        const sqlQuerySelect = 'SELECT id, name FROM bsmoj.contest ';
        const sqlQueryWhere = 'WHERE end_date < CURDATE()';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const endedContest = await this.conn.query(sqlQuery, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return endedContest;
    }

    async GetProblemsById(dto: GetProblemDTO) {
        const { contestId } = dto;
        const sqlQuerySelect = 'SELECT problem_id FROM bsmoj.contest_problem ';
        const sqlQueryWhere = 'where contest_id = ?';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const param = [contestId];
        const problems = await this.conn.query(sqlQuery, param, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        })
        return problems;
    }

    // Todo::Contest, Problem이 존재하지 않을 때 예외처리
    async CreateContestProblemById(dto: CreateProblemDTO) {
        const { problem_id, contest_id } = dto;
        const sqlQuery = 'INSERT INTO bsmoj.contest_problem (problem_id, contest_id) VALUES(?,?)';
        const params = [problem_id, contest_id];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

}
