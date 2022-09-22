import { IsNumber, IsString } from "class-validator";

export class CreateContestDTO {
    @IsString()
    start_date: string;
    @IsNumber()
    time: number;
    @IsString()
    password: string;
}