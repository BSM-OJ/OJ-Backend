import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { LoginDTO } from './dto/login.dto';

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
}
