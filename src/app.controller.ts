import { Controller, Get } from '@nestjs/common';
import { PROJECT } from '@/app.config';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(): any {
    return PROJECT;
  }
}
