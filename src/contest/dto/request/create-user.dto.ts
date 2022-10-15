import { IsNumber } from "class-validator";

export class CreateProblemDTO {

    @IsNumber()
    user_id: number;

    @IsNumber()
    contest_id: number;
}