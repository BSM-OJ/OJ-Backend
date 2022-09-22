import { IsNumber, IsString } from 'class-validator'

export class UploadAnswerSetDTO {
    
    @IsNumber()
    id: number;

    @IsNumber()
    problemId: number;

    @IsString()
    answerInput: string;

    @IsNumber()
    answerOutput: number;

}