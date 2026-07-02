import { CreateHelloDto } from './dto/create-hello.dto';
import { UpdateHelloDto } from './dto/update-hello.dto';
import { Hello, HelloDocument } from './entities/hello.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class HelloService {
  constructor(
    @InjectModel(Hello.name) private readonly helloModel: Model<Hello>,
  ) {}

  create(createHelloDto: CreateHelloDto): Promise<HelloDocument> {
    const createdCat = new this.helloModel(createHelloDto);
    return createdCat.save();
  }

  findAll(): Promise<Hello[]> {
    return this.helloModel.find().exec();
  }

  findOne(id: string): Promise<Hello | null> {
    return this.helloModel.findOne({ id }).exec();
  }

  update(
    id: string,
    updateHelloDto: UpdateHelloDto,
  ): Promise<UpdateWriteOpResult> {
    return this.helloModel
      .updateOne(
        { id },
        {
          $set: updateHelloDto,
        },
      )
      .exec();
  }

  remove(id: string): Promise<DeleteResult> {
    return this.helloModel.deleteOne({ id }).exec();
  }
}
