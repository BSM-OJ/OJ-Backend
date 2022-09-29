import { Injectable, Inject, UnprocessableEntityException} from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateContestDTO } from './dto/create-contest.dto';
@Injectable()
export class ContestService {
    constructor(@Inject(MD_CONNECTION) private connection: any) {}
    private conn = this.connection.pool;
    async getId() {
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
}
