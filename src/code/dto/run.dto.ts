import { IsString } from "class-validator";

export class RunDTO {
    @IsString()
    code: string;

    @IsString()
    stdin: string;
}