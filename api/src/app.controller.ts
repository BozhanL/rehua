import { AppService } from './app.service';
import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
