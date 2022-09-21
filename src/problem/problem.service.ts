import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { DeleteProblemDTO } from './dto/request/delete-problem.dto';
import { UploadProblemDTO } from './dto/request/upload-problem.dto';
import { ViewProblemInfoDTO } from './dto/request/view-problem-info.dto';

@Injectable()
export class ProblemService {

    constructor(@Inject(MD_CONNECTION) private connection: any) {}
    private conn = this.connection.pool;
    
    async ViewProblem() {
        const sqlQuery = 'SELECT * FROM bsmoj.problem';
        const problems = await this.conn.query(sqlQuery);
        return problems;
    }

    async ViewMyProblem(user) {
        const { id } = user;
        const sqlQuerySelect = 'SELECT * FROM bsmoj.problem ';
        const sqlQueryWhere = 'WHERE writer_id = ?';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [id];
        const problems = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return problems;
    }

    async UploadProblem(user, dto: UploadProblemDTO) {
        const { title, content, sources, time_limit, memory_limit } = dto;
        const { id } = user;
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem (writer_id, title, content, sources, time_limit, memory_limit) ';
        const sqlQueryValues = 'VALUES(?,?,?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [id, title, content, sources, time_limit, memory_limit];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return "문제 생성이 완료되었습니다.";
    }

    async ViewProblemInfo(dto: ViewProblemInfoDTO) {
        const { ProblemId } = dto;
        const sqlQuerySelect = 'SELECT * FROM bsmoj.problem ';
        const sqlQueryWhere = 'WHERE id = ?';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [ProblemId];
        const problemInfo = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        if (this.ArrayIsEmpty(problemInfo)) throw new NotFoundException('문제를 찾을 수 없습니다.');
        return problemInfo;
    }

    async DeleteProblem(dto: DeleteProblemDTO) {
        const { ProblemId } = dto;
        await this.ViewProblemInfo(dto);
        const sqlQueryDelete = 'DELETE FROM bsmoj.problem ';
        const sqlQueryWhere = 'WHERE id = ?';
        const sqlQuery = sqlQueryDelete + sqlQueryWhere;
        const params = [ProblemId];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }
    
    private ArrayIsEmpty = <T>(array: T): boolean => {
        if (!Array.isArray(array)) {
            return false;
        }
        return array.length == 0;
    }

}
