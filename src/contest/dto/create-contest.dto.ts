import { IsDate, isDate, IsNumber, IsString } from "class-validator";

export class CreateContestDTO {
    @IsString()
    name: string;
    @IsDate()
    start_date: Date;
    @IsDate()
    end_date: Date;
    @IsString()
    password: string;
}