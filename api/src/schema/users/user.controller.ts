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
import { Controller } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('user')
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
  async findAll(): Promise<(User & { _id: string })[]> {
    const docs = await this.userService.findAll();

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @SwaggerExample.Response('Found', {
    value: new User(
      'ACB123',
      'John',
      'Doe',
      'jd@hospital.com',
      'active',
      '0123456789',
      '123 magic street',
      'nurse',
    ),
  })
  @SwaggerExample.Response('Not found', { value: null })
  @TypedRoute.Get(':id')
  async findOne(
    @TypedParam('id') id: string,
  ): Promise<(User & { _id: string }) | null> {
    const doc = await this.userService.findOne(id);

    const formattedDoc = doc
      ? {
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          ...doc.toJSON(),
          _id: doc._id.toString(),
        }
      : null;

    return formattedDoc;
  }

  @TypedRoute.Get('page/:pageNumber/:pageSize')
  async findPage(
    @TypedParam('pageNumber') pageNumber: number,
    @TypedParam('pageSize') pageSize: number,
  ): Promise<(User & { _id: string })[]> {
    const docs = await this.userService.findPage(pageSize, pageNumber);

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @TypedRoute.Patch(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() updateUserDto: UpdateUserDto,
  ): Promise<UpdateWriteOpResult> {
    return this.userService.update(id, updateUserDto);
  }
}
