import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MD_CONNECTION } from 'database/database.module';

const { SECRET_KEY } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(MD_CONNECTION) private connection: any,
        private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.token;
                }
            ]),
            secretOrKey: SECRET_KEY,
            passReqToCallback: true,
        });
    }
    private conn = this.connection.pool;

    async validate(req: Request) {
        const token = await this.jwtService.verify(req?.cookies?.token, {
            secret: SECRET_KEY,
        });
        if (token === undefined) {
            throw new UnauthorizedException();
        }
        const user = await this.findByEmail(token.email);
        return user;
    }

    private async findByEmail(email: string) {
        const sqlQuerySelect = 'SELECT u.id, u.email, u.nickname, u.submissions, u.problem_solved ';
        const sqlQueryFrom = 'FROM bsmoj.users u WHERE email = ?'
        const sqlQuery = sqlQuerySelect + sqlQueryFrom;
        const params = [email];
        const user = await this.conn.query(sqlQuery, params, (error: string) => {
            if (error) throw new UnprocessableEntityException();
        });
        return user;
    }
}