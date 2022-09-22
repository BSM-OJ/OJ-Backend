import { Injectable, Inject } from '@nestjs/common';
import { RunDTO } from './dto/run.dto';
var fs = require('fs');
import { MD_CONNECTION } from 'database/database.module';
import { ComplieResultDTO } from './dto/compile-result.dto';
import { plainToClass } from 'class-transformer';
const { c, cpp, node, python, java } = require('compile-run');

@Injectable()
export class CodeService {

  constructor(@Inject(MD_CONNECTION) private connection: any) { }
  private conn = this.connection.pool;

  async complie(dto: RunDTO): Promise<ComplieResultDTO> {
    const { type, code, stdin } = dto;

    // 파일 작성
    await fs.writeFile(`public/${type}/1.${type}`, code, function (err) {
      if (err === null) {
        console.log('success');
      } else {
        console.log(err);
      }
    });

    let stderr: string = ''
    let stdout: string = '';
    let runTime: number;
    let memoryUsage: number;

    const resultPromise = this.RunFile(type, stdin);
    const startTime: number = performance.now();
    await resultPromise
      .then(result => {
        const endTime = performance.now();
        if (result.stderr !== '') {
          stderr += result.stderr;
          runTime = (startTime - endTime);
          memoryUsage = result.memoryUsage;
        }
        else {
          stdout += result.stdout //result object
          runTime = (endTime - startTime);
          memoryUsage = result.memoryUsage;
        }
      })
      .catch(err => {
        console.log(err);
      });

    const complieResult: ComplieResultDTO = plainToClass(ComplieResultDTO,
      {
        stderr: stderr,
        stdout: stdout,
        runTime: runTime,
        memoryUsage: memoryUsage
      });

    return complieResult;
  }

  private async RunFile(type: string, stdin: string) {
    switch (type) {
      case "cpp":
        return cpp.runFile(`public/${type}/1.${type}`, { stdin: stdin });
      case "c":
        return c.runFile(`public/${type}/1.${type}`, { stdin: stdin });
      case "node":
        return node.runFile(`public/${type}/1.${type}`, { stdin: stdin });
      case "py":
        return python.runFile(`public/${type}/1.${type}`, { stdin: stdin });
      case "java":
        return java.runFile(`public/${type}/1.${type}`, { stdin: stdin });
    }
  }
}
