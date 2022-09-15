import { Inject, Injectable } from '@nestjs/common';
import { MD_CONNECTION } from 'database/database.module';

@Injectable()
export class ProblemService {

    constructor(@Inject(MD_CONNECTION) private connection: any) {}
    private conn = this.connection.pool;
    
    async ViewProblem() {
        
    }

    async UploadProblem() {
        // this.conn.query()
    }
}
