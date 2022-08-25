import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Get('code')
  Code(): string {
    return this.appService.complie("#include<iostream> \n using namespace std; string a; int main() {cin >> a; cout << a;}");
  }
}
