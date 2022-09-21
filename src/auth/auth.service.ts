import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const { SECRET_KEY } = process.env;

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async getToken(res: Response, email: string, password: string) {
        const payload = { email: email, password: password};

        const token = this.jwtService.sign(payload, {
            secret: SECRET_KEY,
            algorithm: 'HS256',
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        });

        return {
            token
        }
    }

}
