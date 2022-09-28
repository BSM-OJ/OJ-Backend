import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/auth/auth.model';
import { plainToClass } from 'class-transformer';
import { ViewSolvedProblemDTO } from './dto/view-solved-problem.dto';

@Injectable()
export class UserService {
    constructor(@Inject(MD_CONNECTION) private connection: any,
        private readonly authservice: AuthService
    ){}
    private conn = this.connection.pool;

    async register(dto: CreateUserDTO): Promise<string> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            await this.createUser({
            ...dto,
            password: hashedPassword,
        });
        } catch (error) {
            throw new UnprocessableEntityException("테이블 접근이 정상적이지 않습니다.");
        }
        return "회원가입이 완료되었습니다.";
    }

    async createUser(dto: CreateUserDTO): Promise<void> {
        const { nickname, email, password } = dto;
        const sqlQuery = 'INSERT INTO bsmoj.users (email,nickname,submissions,problem_solved,password) VALUES(?,?,0,0,?)';
        const params = [email, nickname, password];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }

    async login(res: Response, dto: LoginDTO) {
        const { email, password } = dto;
        const user = await this.findByEmail(email);
        if (user[0] === undefined) throw new UnprocessableEntityException("이메일을 찾을 수 없습니다.");
        const hashedPassword = user[0].password;
        await this.verifyPassword(password, hashedPassword);      
        return this.authservice.getToken(res, email, hashedPassword);
    }

    private async findByEmail(email: string) {
        const sqlQuery = 'SELECT * FROM bsmoj.users WHERE email = ?';
        const params = [email];
        const user = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return user;
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new NotFoundException("패스워드가 맞지 않습니다.");
        }
    }

    async ViewSolvedProblems(user: User) {
        const { id } = user;
        const sqlQuerySelect = 'SELECT problem_id FROM bsmoj.solved_problems ';
		const sqlQueryWhere = 'WHERE user_id = ? ';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [id];
        const solvedProblems = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        const viewSolvedProblemDto: ViewSolvedProblemDTO = plainToClass(ViewSolvedProblemDTO, {
            numberProblemsSolved: await this.GetNumberProblemsSolved(id),
            solvedProblem: [...solvedProblems]             
        })
        return viewSolvedProblemDto;
    }

    private async GetNumberProblemsSolved(userId: number) {
        const sqlQuerySelect = 'SELECT COUNT(*) AS count FROM bsmoj.solved_problems ';
		const sqlQueryWhere = 'WHERE user_id = ? ';
        const sqlQuery = sqlQuerySelect + sqlQueryWhere;
        const params = [userId];
        const numberProblemsSolved = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return parseInt(numberProblemsSolved[0]['count']);
    }

    async UpdateSolvedProblemNumber(userId: number) {
        const sqlQueryUpdate = 'UPDATE bsmoj.users ';
        const sqlQuerySet = 'SET problem_solved = ? ';
        const sqlQueryWhere = 'WHERE id = ?';
        const sqlQuery = sqlQueryUpdate + sqlQuerySet + sqlQueryWhere;
        const params = [await this.GetNumberProblemsSolved(userId), userId];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
    }
}
