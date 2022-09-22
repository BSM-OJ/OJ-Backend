import { IsNumber, IsString } from 'class-validator'

export class UploadAnswerDTO {

    @IsNumber()
    problemId: number;

    @IsString()
    answerInput: string;

    @IsString()
    answerOutput: string;

}