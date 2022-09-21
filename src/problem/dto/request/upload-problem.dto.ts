
import { IsNumber, IsString, MaxLength } from 'class-validator'

export class UploadProblemDTO {
    @IsString()
    @MaxLength(100)
    title: string;

    @IsString()
    @MaxLength(1000)
    content: string;

    @IsString()
    @MaxLength(100)
    sources: string;

    @IsNumber()
    time_limit: number;

    @IsNumber()
    memory_limit: number;
}