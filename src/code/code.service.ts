import { Injectable, Inject, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { RunDTO } from './dto/request/run.dto';
import { MD_CONNECTION } from 'database/database.module';
import { ComplieResultDTO } from './dto/compile-result.dto';
import { plainToClass } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { c, cpp, node, python, java } from 'compile-run';
import { User } from 'src/auth/auth.model';
import { SubmitDTO } from './dto/request/submit.dto';
import { WrongAnswerDTO } from './dto/wrong-answer.dto';
import { RightAnswerDTO } from './dto/right-answer.dto';
import { performance } from 'perf_hooks';
import { UserService } from 'src/user/user.service';
import * as fs from "fs"; 



@Injectable()
export class CodeService {

	constructor(@Inject(MD_CONNECTION) private connection: any,
		private userservice: UserService) { }
	private conn = this.connection.pool;
	private DEFAULT_TIMELIMIT = 10000;

	async Complie(dto: RunDTO, timeLimit?: number): Promise<ComplieResultDTO> {
		const { type, code, stdin } = dto;

		const startTime = performance.now();
		const result = await this.RunCode(type, code, stdin, timeLimit);
		const endTime = performance.now();

		const adjustedStdout = this.AdjustStdout(result.stdout);
		
		const complieResult: ComplieResultDTO = plainToClass(ComplieResultDTO,
			{
				...result,
				stdout: adjustedStdout,
				stderr: this.AdjustStderr(result.stderr),
				// byte to megabyte
				memoryUsage: result.memoryUsage / 125000,
				runTime: (endTime - startTime)
			}, { excludeExtraneousValues: true });

		return complieResult;
	}

	private async RunCode(type: string, code: string, stdin: string, timeLimit?: number) {
		switch (type) {
			case "cpp":
				return cpp.runSource(code, { stdin: stdin, timeout: timeLimit ?? this.DEFAULT_TIMELIMIT, compileTimeout: timeLimit ?? this.DEFAULT_TIMELIMIT }, (err, result) => {
					return result;
				});
			case "c":
				return c.runSource(code, { stdin: stdin, timeout: timeLimit ?? this.DEFAULT_TIMELIMIT, compileTimeout: timeLimit ?? this.DEFAULT_TIMELIMIT }, (err, result) => {
					return result;
				});
			case "node":
				return node.runSource(code, { stdin: stdin, timeout: timeLimit ?? this.DEFAULT_TIMELIMIT, compileTimeout: timeLimit ?? this.DEFAULT_TIMELIMIT }, (err, result) => {
					return result;
				});
			case "py":
				const utf8EncodingSetting = 
				"import sys\nimport io\nsys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')\nsys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')\n"
				return python.runSource(utf8EncodingSetting + code, { stdin: stdin, timeout: timeLimit ?? this.DEFAULT_TIMELIMIT, compileTimeout: timeLimit ?? this.DEFAULT_TIMELIMIT }, (err, result) => {
					return result;
				});
			case "java":
				fs.writeFile('public/java/BOJ.java', code, (err) => {
					if (err) throw new NotFoundException("java ?????? ??????????????? ?????? ??? ????????????.");
				})
				return java.runFile('public/java/BOJ.java', { stdin: stdin, timeout: timeLimit ?? this.DEFAULT_TIMELIMIT, compileTimeout: timeLimit ?? this.DEFAULT_TIMELIMIT }, (err, result) => {
					return result;
				})
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
		if (this.ArrayIsEmpty(problemInfo)) throw new NotFoundException('????????? ?????? ??? ????????????.');
	}

	async Submit(user: User, dto: SubmitDTO) {

		const { problemId } = dto;
		const sqlQuerySelect = 'SELECT answer_input, answer_output FROM bsmoj.problem_answer_set ';
		const sqlQueryWhere = 'WHERE problem_id = ? ';
		const sqlQuery = sqlQuerySelect + sqlQueryWhere;
		const params = [problemId];
		const testcases = await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});
		if (this.ArrayIsEmpty(testcases)) throw new NotFoundException("????????? ?????? ????????? ???????????? ?????? ??? ????????????.");
		// ?????? ?????? ??????
		await this.userservice.UpdateSubmissionsNumber(user);
		const { timeLimit, memoryLimit } = await this.GetProblemTimeLimitAndMemoryLimit(problemId);
		for (let i = 0; i < testcases.length; i++) {
			const testcase = testcases[i];

			const rundto: RunDTO = {
				type: dto.type,
				code: dto.code,
				stdin: testcase.answer_input
			}
			const result = await this.Complie(rundto, timeLimit);

			// ?????? ??????
			// run-timeout : ???????????? ?????? ?????? ???
			// run-time : ?????? ?????? ?????? ????????? or ????????? ??????
			if (result.errorType === 'run-timeout' || (result.errorType === 'run-time' && !result.stderr)) {
				await this.userservice.UpdateTLENumber(user);
				const wrongAnswer: WrongAnswerDTO = plainToClass(WrongAnswerDTO, {
					message: "?????? ?????? ?????????.",
					testcaseNumber: i + 1,
					stderr: result.stderr,
					stdout: result.stdout
				})
				return wrongAnswer;
			}
			// ????????? ??????
			if (result.memoryUsage > memoryLimit) {
				await this.userservice.UpdateMLENumber(user);
				const wrongAnswer: WrongAnswerDTO = plainToClass(WrongAnswerDTO, {
					message: "????????? ?????? ?????????.",
					testcaseNumber: i + 1,
					stderr: result.stderr,
					stdout: result.stdout
				});
				return wrongAnswer;
			}
			// ??????
			if (result.stdout !== testcase.answer_output) {
				if (result.stderr) await this.userservice.UpdateCompilationErrorNumber(user);
				else await this.userservice.UpdateWrongAnswerNumber(user);
				const wrongAnswer: WrongAnswerDTO = plainToClass(WrongAnswerDTO, {
					message: "???????????????.",
					testcaseNumber: i + 1,
					stderr: result.stderr,
					stdout: result.stdout
				});
				return wrongAnswer;
			}
		}

		await this.Solved(user, problemId);
		const rightAnswer: RightAnswerDTO = plainToClass(RightAnswerDTO, {
			message: "???????????????.",
		});
		return rightAnswer;
	}

	private async alreadySolved(id: number, problemId: number): Promise<boolean> {
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

	private async Solved(user: User, problemId: number): Promise<void> {
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

		await this.userservice.UpdateSolvedProblemNumber(id);
	}

	private async GetProblemTimeLimitAndMemoryLimit(problemId: number) {
		const sqlQuerySelect = 'SELECT time_limit, memory_limit FROM bsmoj.problem ';
		const sqlQueryWhere = 'WHERE id = ? ';
		const sqlQuery = sqlQuerySelect + sqlQueryWhere;
		const params = [problemId];
		const problem = await this.conn.query(sqlQuery, params, (error: string) => {
			if (error) throw new UnprocessableEntityException();
		});

		return {
			// millisecond to second
			timeLimit: problem[0].time_limit * 1000,
			memoryLimit: problem[0].memory_limit
		};
	}

	private AdjustStdout(stdout: string) {
		// \r ??????
		let adjustedStdout = stdout.replace(/\r/g, "");
		// ?????? \n ??????
		const length = adjustedStdout.length;
		if (adjustedStdout.substring(length - 1, length) === '\n') {
			adjustedStdout = adjustedStdout.substring(0, length - 1);
		}		
		return adjustedStdout;
	}

	private AdjustStderr(stderr: string) {
		const adjustedStderr = stderr.split('\\').slice(-1)[0];
		return adjustedStderr;
	}
}
