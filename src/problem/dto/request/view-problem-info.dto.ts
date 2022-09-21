
import { IsNumber } from 'class-validator'

export class ViewProblemInfoDTO {
    @IsNumber()
    ProblemId: number;
}