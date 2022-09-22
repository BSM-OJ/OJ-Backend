import { IsString } from "class-validator";

export class RunDTO {
    @IsString() 
    type: string;

    @IsString()
    code: string;

    @IsString()
    stdin: string;
}