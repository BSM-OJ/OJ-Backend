import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
var fs = require('fs');
const {c, cpp, node, python, java} = require('compile-run');

@Injectable()
export class CodeService {
    async complie(code: string): Promise<string> {
        fs.writeFile('cpp/1.cpp',code,function(err){
          if (err === null) {
              console.log('success');
          } else {
              console.log(err);
          }
        });
    
        let stdout: string = '';
        let resultPromise = cpp.runFile('cpp/1.cpp', { stdin:'anoneanoneanone'});
        await resultPromise
          .then(result => {
              stdout += result.stdout //result object
          })
          .catch(err => {
              console.log(err)
          });
        return stdout;
      }
}
