import { Injectable } from '@nestjs/common';
import { connected } from 'process';
var fs = require('fs');
const {c, cpp, node, python, java} = require('compile-run');

@Injectable()
export class AppService {
  complie(code: string): any {
    fs.writeFile('cpp/1.cpp',code,function(err){
      if (err === null) {
          console.log('success');
      } else {
          console.log(err);
      }
    });


    let resultPromise = cpp.runFile('cpp/1.cpp', { stdin:'anoneanoneanone'});
    resultPromise
      .then(result => {
          return result; //result object
      })
      .catch(err => {
          return err;
      });
    return code;
  }
}
