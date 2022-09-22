import { Injectable, Inject, UnprocessableEntityException} from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateContestDTO } from './dto/create-contest.dto';
@Injectable()
export class ContestService {
    constructor(@Inject(MD_CONNECTION) private connection: any) {}
    private conn = this.connection.pool;
    async CreateContest(dto: CreateContestDTO) {
        const { start_date, time, password} = dto;
        const sqlQuery = 'INSERT INTO bsmoj.contest (start_date, time, password) VALUES(?, ?, ?)';
        const params = [start_date, time, password];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return "대회 생성이 완료되었스빈다."
    }
}
