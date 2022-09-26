import { Expose } from "class-transformer";

export class ProblemExampleDTO {

    @Expose()
    example_input: string;

    @Expose()
    example_output: string;
    
}