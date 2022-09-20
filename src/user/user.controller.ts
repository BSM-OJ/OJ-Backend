import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userservice: UserService) {}

    @Post('create')
    createUser(@Body() dto: CreateUserDTO) {
        return this.userservice.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDTO) {
        return this.userservice.login(dto);
    }
    
}
