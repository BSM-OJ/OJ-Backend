import { IsString, Matches, MaxLength, IsEmail } from 'class-validator'

export class LoginDTO {
    @IsString()
    @IsEmail()
    @MaxLength(30)
    email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;
}