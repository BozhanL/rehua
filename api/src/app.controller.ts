import { AppService } from './app.service';
import { Roles } from '@/auth/roles.decorator';
import { SwaggerExample, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';

@Roles('admin', 'nurse')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SwaggerExample.Response('Hello World!')
  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
