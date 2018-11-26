import { Controller, Get } from '@nestjs/common';

@Controller('nestjs')
export class NestJSTestController {
  constructor() {}

  @Get()
  public test() {
    return 'ok';
  }
}
