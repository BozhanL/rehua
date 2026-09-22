import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { hash } from 'node:crypto';

const SALT_ROUND = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const password = await bcrypt.hash(
      // Reduce the length to < 72 bytes
      hash('sha512', createUserDto.password, { outputEncoding: 'buffer' }),
      SALT_ROUND,
    );

    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    return this.userModel.create({ ...createUserDto, password });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ _id: 1 }).exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findOneUserNameForAuth(userName: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userName: userName }).exec();
  }

  async findPage(
    numberOfRows: number,
    pageNumber: number,
  ): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .sort({ userName: 'asc' })
      .skip((pageNumber - 1) * numberOfRows)
      .limit(numberOfRows)
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateWriteOpResult> {
    let password = updateUserDto.password;
    if (password !== undefined) {
      password = await bcrypt.hash(
        // Reduce the length to < 72 bytes
        hash('sha512', password, { outputEncoding: 'buffer' }),
        SALT_ROUND,
      );
    }

    return this.userModel
      .updateOne(
        { _id: id },
        {
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          $set: { ...updateUserDto, password },
        },
      )
      .exec();
  }
}
