import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { DeleteProblemDTO } from './dto/request/delete-problem.dto';
import { UploadAnswerDTO } from './dto/request/upload-answer.dto';
import { UploadExampleDTO } from './dto/request/upload-example.dto';
import { UploadProblemDTO } from './dto/request/upload-problem.dto';
import { ViewProblemInfoDTO } from './dto/request/view-problem-info.dto';
import { v4 as uuid } from 'uuid';

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
        const problemId = await this.GetLastId();
        return problemId[0];
    }

    private async GetLastId() {
        const sqlQuerySelect = 'SELECT id AS ProblemId FROM bsmoj.problem ';
        const sqlQueryOrder = 'ORDER BY id DESC ';
        const sqlQueryLimit = 'Limit 1';
        const sqlQuery = sqlQuerySelect + sqlQueryOrder + sqlQueryLimit;
        return await this.conn.query(sqlQuery);
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

    async UploadProblemExample(dto: UploadExampleDTO) {
        const {problemId, exampleInput, exampleOutput} = dto;
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem_example_set (id, problem_id, example_input, example_output) ';
        const sqlQueryValues = 'VALUES(?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [uuid(), problemId, exampleInput, exampleOutput];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

    async UploadProblemAnswer(dto: UploadAnswerDTO) {
        const {problemId, answerInput, answerOutput} = dto;
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem_answer_set (id, problem_id, answer_input, answer_output) ';
        const sqlQueryValues = 'VALUES(?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [uuid(), problemId, answerInput, answerOutput];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

}
