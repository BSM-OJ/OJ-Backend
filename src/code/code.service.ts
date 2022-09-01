import { Injectable } from '@nestjs/common';
import { RunDTO } from './dto/run.dto';
var fs = require('fs');
const { c, cpp, node, python, java } = require('compile-run');

@Injectable()
export class CodeService {
  async complie(dto: RunDTO): Promise<string> {
    const { code, stdin } = dto;

    // 파일 작성
    fs.writeFile('public/cpp/1.cpp', code, function (err) {
      if (err === null) {
        console.log('success');
      } else {
        console.log(err);
      }
    });

    let stdout: string = '';
    let resultPromise = cpp.runFile('public/cpp/1.cpp', { stdin: stdin });
    // 시간 재기
    let startTime: number = performance.now();
    let endTime: number;
    await resultPromise
    .then(result => {
      endTime = performance.now();
      stdout += result.stdout //result object
    })
    .catch(err => {
      console.log(err);
      });
    console.log(`Result Time : ${endTime - startTime} ms`);
    return stdout;
  }

  
}
