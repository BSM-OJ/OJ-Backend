import { IsNumber, IsString, MaxLength } from 'class-validator'

export class DeleteProblemDTO {
    @IsNumber()
    ProblemId: number;
}