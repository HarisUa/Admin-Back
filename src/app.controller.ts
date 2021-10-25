import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('ping')
  @ApiOkResponse({ description: 'success message' })
  ping() {
    return { message: 'PONG' };
  }

  @Get('v1/ping')
  @ApiOkResponse({ description: 'success message' })
  pingV1() {
    return { message: 'PONG' };
  }
}
