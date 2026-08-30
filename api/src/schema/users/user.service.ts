import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
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
    return this.userModel
      .updateOne(
        { _id: id },
        {
          $set: updateUserDto,
        },
      )
      .exec();
  }
}
