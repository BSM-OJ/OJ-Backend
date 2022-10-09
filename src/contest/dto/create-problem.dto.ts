import { IsDate, isDate, IsNumber, IsString } from "class-validator";

export class CreateProblemDTO {
    @IsNumber()
    problem_id: number;
    @IsNumber()
    contest_id: number;
}