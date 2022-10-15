import { Controller, Get, Post, UseGuards, Body, Param, Delete } from '@nestjs/common';
import { User } from 'src/auth/auth.model';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ProblemInfoDTO } from './dto/problem-info.dto';
import { DeleteProblemDTO } from './dto/request/delete-problem.dto';
import { UploadAnswerDTO } from './dto/request/upload-answer.dto';
import { UploadExampleDTO } from './dto/request/upload-example.dto';
import { UploadProblemDTO } from './dto/request/upload-problem.dto';
import { ViewProblemInfoDTO } from './dto/request/view-problem-info.dto';
import { ProblemService } from './problem.service';

@UseGuards(JwtAuthGuard)
@Controller('problem')
export class ProblemController {
	constructor(private readonly problemservice: ProblemService) { }

	@Get()
	viewProblem() {
		return this.problemservice.ViewProblem();
	}

	@Get('my')
	viewMyProblem(@GetUser() user: User) {
		return this.problemservice.ViewMyProblem(user);
	}

	@Get(':ProblemId')
	viewProblemInfo(
		@Param() dto: ViewProblemInfoDTO): Promise<ProblemInfoDTO> {
		return this.problemservice.ViewProblemInfo(dto);
	}

	@Post()
	uploadProblem(
		@GetUser() user: User,
		@Body() dto: UploadProblemDTO): Promise<number> {
		return this.problemservice.UploadProblem(user, dto);
	}

	@Delete(':ProblemId')
	deleteProblem(@Param() dto: DeleteProblemDTO): Promise<void> {
		return this.problemservice.DeleteProblem(dto);
	}

	@Post('upload/exampleSet')
	uploadProblemExample(@Body() dto: UploadExampleDTO): Promise<void> {
		return this.problemservice.UploadProblemExample(dto);
	}

	@Post('upload/answerSet')
	uploadProblemAnswer(@Body() dto: UploadAnswerDTO): Promise<void> {
		return this.problemservice.UploadProblemAnswer(dto);
	}

}
