import { Controller, Post, Body, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UserService } from './user.service';

// Todo:: 잘못된풀이 시간초과 횟수 유저 저장
@Controller('user')
export class UserController {
    constructor(private readonly userservice: UserService) { }

    @Post('create')
    createUser(@Body() dto: CreateUserDTO) {
        return this.userservice.register(dto);
    }

    @Post('login')
    login(@Res({passthrough: true}) res: Response,
        @Body() dto: LoginDTO) {
        return this.userservice.login(res, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserInfo(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('problems')
    viewSolvedProblems(@GetUser() user: User) {
        return this.userservice.ViewSolvedProblems(user);
    }
    
}
