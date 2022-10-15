import { IsNumber } from "class-validator";

export class DeleteProblemDTO {

    @IsNumber()
    problem_id: number;

    @IsNumber()
    contest_id: number;

}