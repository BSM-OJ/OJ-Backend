import { IsString, IsIn } from "class-validator";

export class RunDTO {
    @IsString() 
    @IsIn(["cpp", "py", "node", "c", "java"])
    type: string;

    @IsString()
    code: string;

    @IsString()
    stdin: string;
}