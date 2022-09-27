import { Expose } from "class-transformer";

export class ComplieResultDTO {
    @Expose()
    stderr: string;

    @Expose()
    stdout: string;
    
    @Expose()
    errorType: string;

    @Expose()
    runTime: number;

    @Expose()
    memoryUsage: number;

}