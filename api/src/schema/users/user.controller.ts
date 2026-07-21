import type { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Controller, Param } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createUserDto: CreateUserDto,
  ): Promise<User & { _id: string }> {
    const doc = await this.userService.create(createUserDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @TypedRoute.Get(':id')
  @SwaggerExample.Response('Found', {
    value: new User(
      '1',
      'DEF4568',
      'John',
      'Doe',
      'email@domain.com',
      'active',
      '+64123456789',
      '123 drive, city, suburb',
      'nurse',
    ),
  })
  @SwaggerExample.Response('Not found', { value: null })
  async findOne(@TypedParam('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @TypedRoute.Patch('id')
  async update(
    @Param('id') id: string,
    @TypedBody() UpdateUserDto: UpdateUserDto,
  ): Promise<UpdateWriteOpResult> {
    return this.userService.update(id, UpdateUserDto);
  }
}
