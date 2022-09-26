import { IsNumber, IsString, IsIn } from "class-validator";

export class SubmitDTO {
    
    @IsString() 
    @IsIn(["cpp", "py", "node", "c", "java"])
    type: string;

    @IsString()
    code: string;

    @IsNumber()
    problemId: number;
}