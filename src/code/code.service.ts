import { Injectable, Inject, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { RunDTO } from './dto/request/run.dto';
import { MD_CONNECTION } from 'database/database.module';
import { ComplieResultDTO } from './dto/compile-result.dto';
import { plainToClass } from 'class-transformer';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { c, cpp, node, python, java } from 'compile-run';
import { User } from 'src/auth/auth.model';
import { SubmitDTO } from './dto/request/submit.dto';
import { WrongAnswerDTO } from './dto/wrong-answer.dto';
import { RightAnswerDTO } from './dto/right-answer.dto';
import { performance } from 'perf_hooks';

@Injectable()
export class CodeService {

	constructor(@Inject(MD_CONNECTION) private connection: any) { }
	private conn = this.connection.pool;

	async complie(dto: RunDTO): Promise<ComplieResultDTO> {
		const { type, code, stdin } = dto;

		fs.writeFile(`public/${type}/1.${type}`, code, () => null);

		let stderr: string = '';
		let stdout: string = '';
		let runTime: number;
		let memoryUsage: number;

		const startTime: number = performance.now();
		const resultPromise = this.RunFile(type, stdin);
		// Todo :: Then 리팩토링
		resultPromise
			.then(result => {
				const endTime = performance.now();
				if (result.stderr !== '') {
					stderr += result.stderr;
					runTime = (startTime - endTime);
					memoryUsage = result.memoryUsage;
				}
				else {
					stdout += result.stdout //result object
					runTime = (endTime - startTime);
					memoryUsage = result.memoryUsage;
				}
			})
			.catch(err => {
				console.log(err);
			});

		const complieResult: ComplieResultDTO = plainToClass(ComplieResultDTO,
		{
			stderr: stderr,
			stdout: stdout,
			runTime: runTime,
			memoryUsage: memoryUsage
		});

		return complieResult;
	}

	private async RunFile(type: string, stdin: string) {
		switch (type) {
			case "cpp":
				return cpp.runFile(`public/${type}/1.${type}`, { stdin: stdin });
			case "c":
				return c.runFile(`public/${type}/1.${type}`, { stdin: stdin });
			case "node":
				return node.runFile(`public/${type}/1.${type}`, { stdin: stdin });
			case "py":
				return python.runFile(`public/${type}/1.${type}`, { stdin: stdin });
			case "java":
				return java.runFile(`public/${type}/1.${type}`, { stdin: stdin });
		}
	}

	private async ValidateProblem(problemId: number) {
		const sqlQuerySelect = 'SELECT * FROM bsmoj.problem ';
		const sqlQueryWhere = 'WHERE id = ?';
		const sqlQuery = sqlQuerySelect + sqlQueryWhere;
		const params = [problemId];
		const problemInfo = await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});
		if (this.ArrayIsEmpty(problemInfo)) throw new NotFoundException('문제를 찾을 수 없습니다.');
	}

	private async alreadySolved(id: number, problemId: number) {
		const sqlQuerySelect = 'SELECT * FROM bsmoj.solved_problems ';
		const sqlQueryWhere = 'WHERE user_id = ? AND problem_id = ?';
		const sqlQuery = sqlQuerySelect + sqlQueryWhere;
		const params = [id, problemId];
		const solvedProblem = await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});
		if (this.ArrayIsEmpty(solvedProblem)) return false;
		else return true;
	}

	private ArrayIsEmpty = <T>(array: T): boolean => {
		if (!Array.isArray(array)) {
			return false;
		}
		return array.length == 0;
	}

	private async solved(user: User, problemId: number) {
		const { id } = user;
		await this.ValidateProblem(problemId);
		if (await this.alreadySolved(id, problemId)) return;
		const sqlQueryInsert = 'INSERT INTO bsmoj.solved_problems (id, user_id, problem_id) ';
		const sqlQueryValues = 'VALUES(?,?,?)';
		const sqlQuery = sqlQueryInsert + sqlQueryValues;
		const params = [uuid(), id, problemId];
		await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});
	}

	async submit(user: User, dto: SubmitDTO) {
		const { problemId } = dto;
		const sqlQuerySelect = 'SELECT answer_input, answer_output FROM bsmoj.problem_answer_set ';
		const sqlQueryWhere = 'WHERE problem_id = ? ';
		const sqlQuery = sqlQuerySelect + sqlQueryWhere;
		const params = [problemId];

		const testcases = await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});

		if (this.ArrayIsEmpty(testcases)) throw new NotFoundException("문제에 대한 테스트 케이스를 찾을 수 없습니다.");

		// Todo:: 시간초과 처리
		// Todo:: 메모리 처리

		for (let i = 0; i < testcases.length; i++) {
			const testcase = testcases[i];
			const rundto: RunDTO = {
				type: dto.type,
				code: dto.code,
				stdin: testcase.answer_input
			}
			const result = await this.complie(rundto)
			if (result.stdout !== testcase.answer_output) {
				const wrongAnswer: WrongAnswerDTO = plainToClass(WrongAnswerDTO, {
					message: "오답입니다.",
					testcaseNumber: i + 1,
					stderr: result.stderr,
					stdout: result.stdout
				});
				return wrongAnswer;
			}
		}

		await this.solved(user, problemId);
		const rightAnswer: RightAnswerDTO = plainToClass(RightAnswerDTO, {
			message: "정답입니다.",
		});
		return rightAnswer;
	}
}
