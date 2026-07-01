import { AppService } from './app.service';
import { SwaggerExample, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SwaggerExample.Response('Hello World!')
  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
