import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { DeleteProblemDTO } from './dto/request/delete-problem.dto';
import { UploadAnswerDTO } from './dto/request/upload-answer.dto';
import { UploadExampleDTO } from './dto/request/upload-example.dto';
import { UploadProblemDTO } from './dto/request/upload-problem.dto';
import { ViewProblemInfoDTO } from './dto/request/view-problem-info.dto';
import { v4 as uuid } from 'uuid';
import { User } from 'src/auth/auth.model';
import { plainToClass } from 'class-transformer';
import { ProblemInfoDTO } from './dto/problem-info.dto';
import { ProblemExampleDTO } from './dto/problem-examples.dto';

@Injectable()
export class ProblemService {

    constructor(@Inject(MD_CONNECTION) private connection: any) { }
    private conn = this.connection.pool;

    async ViewProblem() {
        const sqlQuery = 'SELECT * FROM bsmoj.problem';
        const problems = await this.conn.query(sqlQuery);
        return problems;
    }

    async ViewMyProblem(user: User) {
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

    async UploadProblem(user: User, dto: UploadProblemDTO) {
        const { title, content, difficulty, sources, time_limit, memory_limit } = dto;
        const { id } = user;
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem (writer_id, title, content, difficulty, sources, time_limit, memory_limit) ';
        const sqlQueryValues = 'VALUES(?,?,?,?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [id, title, content, difficulty, sources, time_limit, memory_limit];
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
        const problemInfoWithExamples: ProblemInfoDTO = plainToClass(ProblemInfoDTO, {
            ...problemInfo[0],
            problem_examples: (await this.ViewProblemExamples(ProblemId))
        }, {excludeExtraneousValues: true});
        return problemInfoWithExamples;
    }

    private async VaildateProblem(problemId: number) {
        const sqlQuerySelect = 'SELECT * FROM bsmoj.problem ';
        const sqlQueryWhere = 'WHERE id = ?';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [problemId];
        const problemInfo = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        if (this.ArrayIsEmpty(problemInfo)) throw new NotFoundException('문제를 찾을 수 없습니다.');
    }

    async ViewProblemExamples(problemId: number) {
        const sqlQuerySelect = 'SELECT example_input, example_output FROM bsmoj.problem_example_set ';
        const sqlQueryWhere = 'WHERE problem_id = ?'
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [problemId];
        const problemExamples = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        const problemExampleDtos: ProblemExampleDTO[] = [...problemExamples];
        return problemExampleDtos;
    }

    async DeleteProblem(dto: DeleteProblemDTO): Promise<void> {
        const { ProblemId } = dto;
        await this.VaildateProblem(ProblemId);
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

    async UploadProblemExample(dto: UploadExampleDTO): Promise<void> {
        const { problemId, exampleInput, exampleOutput } = dto;
        await this.VaildateProblem(problemId);
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem_example_set (id, problem_id, example_input, example_output) ';
        const sqlQueryValues = 'VALUES(?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [uuid(), problemId, exampleInput, exampleOutput];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

    async UploadProblemAnswer(dto: UploadAnswerDTO): Promise<void> {
        const { problemId, answerInput, answerOutput } = dto;
        await this.VaildateProblem(problemId);
        const sqlQueryInsert = 'INSERT INTO bsmoj.problem_answer_set (id, problem_id, answer_input, answer_output) ';
        const sqlQueryValues = 'VALUES(?,?,?,?)';
        const sqlQuery = sqlQueryInsert + sqlQueryValues;
        const params = [uuid(), problemId, answerInput, answerOutput];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }
}
