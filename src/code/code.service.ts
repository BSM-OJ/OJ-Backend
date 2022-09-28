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

		const startTime = performance.now();
		const result = await this.RunCode(type, code, stdin);
		const endTime = performance.now();

		const complieResult: ComplieResultDTO = plainToClass(ComplieResultDTO,
		{
			...result,
			runTime: (endTime - startTime)
		}, {excludeExtraneousValues: true});

		return complieResult;
	}

	private async RunCode(type: string, code: string, stdin: string) {
		switch (type) {
			case "cpp":
				return cpp.runSource(code, { stdin: stdin }, (err, result) => {
					return result; 
				});
			case "c":
				return c.runSource(code, { stdin: stdin }, (err, result) => {
					return result; 
				});
			case "node":
				return node.runSource(code, { stdin: stdin }, (err, result) => {
					return result; 
				});
			case "py":
				return python.runSource(code, { stdin: stdin }, (err, result) => {
					return result; 
				});
			case "java":
				return java.runSource(code, { stdin: stdin }, (err, result) => {
					return result; 
				});
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
			const adjustedStdout = this.adjustString(result.stdout);
			if (adjustedStdout !== testcase.answer_output) {
				const wrongAnswer: WrongAnswerDTO = plainToClass(WrongAnswerDTO, {
					message: "오답입니다.",
					testcaseNumber: i + 1,
					stderr: result.stderr,
					stdout: adjustedStdout
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

	adjustString(result: string) {
		let adjustedString = result.replace('\r', '');
		// 끝에 \n 여부
		const length = adjustedString.length;
		if (adjustedString.substring(length-1, length) === '\n') {
			adjustedString = adjustedString.substring(0, length-1);	
		}
		// \r 삭제
		adjustedString = adjustedString.replace('\r', '')
		return adjustedString;
	}
}
