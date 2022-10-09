import { IsString } from "class-validator";

export class GetProblemDTO {

    @IsString()
    contestId: string;

}