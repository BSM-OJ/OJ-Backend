import { Expose } from "class-transformer";

export class ViewSolvedProblemDTO {
    
    @Expose()
    numberProblemsSolved: number;

    @Expose()
    solvedProblem: {
        problemId: number
    }[]
    
}