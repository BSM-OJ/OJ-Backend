import { Expose } from "class-transformer";

export class RightAnswerDTO {
    @Expose()
    message: string;
}