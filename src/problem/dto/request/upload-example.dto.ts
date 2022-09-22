import { IsNumber, IsString } from 'class-validator'

export class UploadExampleDTO {
    
    @IsNumber()
    problemId: number;

    @IsString()
    exampleInput: string;

    @IsString()
    exampleOutput: string;
}