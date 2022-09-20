import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    constructor(@Inject(MD_CONNECTION) private connection: any,
                // private jwtService: JwtService
    ) {}
    private conn = this.connection.pool;
  
    async login(dto: LoginDTO) {
        const {email, password} = dto;
        // todo valdate
        const sqlQuery = 'SELECT * FROM bsmoj.users WHERE email = ?';
        const params = [email];
        const user = await this.conn.query(sqlQuery, params, (error: string) => {
            if(error) throw new UnprocessableEntityException();
        });
        if (user[0] === undefined) throw new UnprocessableEntityException("유저 정보를 찾을 수 없습니다.");
        console.log(user[0]);
        await this.verifyPassword(password, user[0].password);
        
        // if (await this.getAuthenticatedUser(email, password)) {
        //     const payload = { email: email, sub: '0' };
            // return this.jwtService.sign(payload);
        // }
        // throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    async register(dto: CreateUserDTO): Promise<string> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
          await this.createUser({
            ...dto,
            password: hashedPassword,
          });
        } catch (error) {
          throw new UnauthorizedException();
        }
        return "회원가입이 완료되었습니다.";
    }

    async createUser(dto: CreateUserDTO): Promise<void> {
        const { nickname, email, password } = dto;
        const sqlQuery = 'INSERT INTO bsmoj.users (email,nickname,submissions,problem_solved,password) VALUES(?,?,0,0,?)';
        const params = [email, nickname, password];
        await this.conn.query(sqlQuery, params, (error: string) => {
            if(error) throw new UnprocessableEntityException();
        }); 
    }    

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
        //   const user = await this.getByEmail(email);
        //   console.log(user.password);
        //   await this.verifyPassword(plainTextPassword, user.password);
        //   user.password = undefined;
          return true;
        } catch (error) {
        //   throw new UnauthorizedException("잘못된 인증 정보입니다.");
        }
      }
      
      private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
          plainTextPassword,
          hashedPassword
        );
        if (!isPasswordMatching) {
            throw new UnauthorizedException();
        }
      }
}
