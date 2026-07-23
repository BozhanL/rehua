import { CreateTemplateDto } from './dto/create-template.dto';
import { Template, TemplateDocument } from './entities/template.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  async create(
    createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateDocument> {
    return this.templateModel.create(createTemplateDto);
  }

  async findOne(id: string): Promise<TemplateDocument | null> {
    return this.templateModel.findById(id).exec();
  }

  async findAll(): Promise<TemplateDocument[]> {
    return this.templateModel.find().exec();
  }

  async remove(id: string): Promise<TemplateDocument | null> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
