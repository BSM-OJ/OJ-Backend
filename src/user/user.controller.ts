import { Controller, Post, Body, Get, UseGuards, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { GetUserInfoDTO } from './dto/request/get-user-info.dto';
import { LoginDTO } from './dto/request/login.dto';
import { ViewSolvedProblemDTO } from './dto/view-solved-problem.dto';
import { Token } from '../auth/token.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userservice: UserService) { }

    @Post('create')
    createUser(@Body() dto: CreateUserDTO): Promise<string> {
        return this.userservice.register(dto);
    }

    @Post('login')
    login(@Res({passthrough: true}) res: Response,
        @Body() dto: LoginDTO): Promise<Token> {
        return this.userservice.login(res, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    logout(@Res({passthrough: true}) res: Response) {
        return this.userservice.logout(res);
    }


    @UseGuards(JwtAuthGuard)
    @Get()
    getMyInfo(@GetUser() user: User): User {
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('problems')
    viewSolvedProblems(@GetUser() user: User): Promise<ViewSolvedProblemDTO> {
        return this.userservice.ViewSolvedProblems(user);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    getUserInfo(@Param() dto: GetUserInfoDTO): Promise<User> {
        return this.userservice.GetUserInfo(dto);
    }
}
