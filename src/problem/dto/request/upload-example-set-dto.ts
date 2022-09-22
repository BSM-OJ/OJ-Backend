import { IsNumber, IsString } from 'class-validator'

export class UploadAnswerSetDTO {
    
    @IsNumber()
    id: number;

    @IsNumber()
    problemId: number;

    @IsString()
    ExampleInput: string;

    @IsNumber()
    ExampleOutput: number;

}