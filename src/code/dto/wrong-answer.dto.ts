import { Expose } from "class-transformer";

export class WrongAnswerDTO {
    @Expose()
    message: string;
    
    @Expose()
    testcaseNumber: number;

    @Expose()
    stderr: string;

    @Expose()
    stdout: string;
}