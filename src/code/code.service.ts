import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
import { RunDTO } from './dto/run.dto';
var fs = require('fs');
const {c, cpp, node, python, java} = require('compile-run');

@Injectable()
export class CodeService {
  async complie(dto: RunDTO): Promise<string> {
        const { code, stdin } = dto;
        // code = String.raw`${code}`;
        console.log(code);
        fs.writeFile('cpp/1.cpp',code,function(err){
          if (err === null) {
              console.log('success');
          } else {
              console.log(err);
          }
        });
    
        let stdout: string = '';
        let resultPromise = cpp.runFile('cpp/1.cpp', { stdin: stdin });
        await resultPromise
          .then(result => {
              console.log(result)
              stdout += result.stdout //result object
          })
          .catch(err => {
              console.log(err)
          });
        return stdout;
      }
}
