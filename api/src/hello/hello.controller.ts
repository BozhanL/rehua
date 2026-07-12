import type { CreateHelloDto } from './dto/create-hello.dto';
import { UpdateHelloDto } from './dto/update-hello.dto';
import { Hello } from './entities/hello.entity';
import { HelloService } from './hello.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Controller, Param } from '@nestjs/common';
import { UpdateWriteOpResult, DeleteResult } from 'mongoose';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createHelloDto: CreateHelloDto,
  ): Promise<Hello & { _id: string }> {
    const doc = await this.helloService.create(createHelloDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get()
  async findAll(): Promise<Hello[]> {
    return this.helloService.findAll();
  }

  @TypedRoute.Get(':id')
  @SwaggerExample.Response('Found', { value: new Hello('1', 'test') })
  @SwaggerExample.Response('Not found', { value: null })
  async findOne(@TypedParam('id') id: string): Promise<Hello | null> {
    return this.helloService.findOne(id);
  }

  @TypedRoute.Patch(':id')
  async update(
    @Param('id') id: string,
    @TypedBody() updateHelloDto: UpdateHelloDto,
  ): Promise<UpdateWriteOpResult> {
    return this.helloService.update(id, updateHelloDto);
  }

  @TypedRoute.Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.helloService.remove(id);
  }
}
