import { IsNumber } from 'class-validator'

export class GetUserInfoDTO {
    
    @IsNumber()
    userId: number;

}