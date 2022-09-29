import { Expose } from "class-transformer";
import { ProblemExampleDTO } from "./problem-examples.dto";

export class ProblemInfoDTO {
    @Expose()
    id: number;

    @Expose()
    writer_id: number;

    @Expose()
    title: string;

    @Expose()
    content: string;

    @Expose()
    difficulty: string;
    
    @Expose()
    sources: string;

    @Expose()
    time_limit: number;

    @Expose()
    memory_limit: number;

    @Expose()
    problem_examples: ProblemExampleDTO[] 
}