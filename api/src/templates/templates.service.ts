import type { CreateTemplateDto } from './dto/create-template.dto';
import { Template, TemplateDocument } from './entities/template.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<Template>,
  ) {}

  async create(
    createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateDocument> {
    const version = await this.templateModel
      .findOne({
        templateName: createTemplateDto.templateName,
      })
      .sort({ version: -1 })
      .select({ _id: 0, version: 1 })
      .exec();

    const data = new Template(
      version ? version.version + 1 : 0,
      createTemplateDto,
    );
    return this.templateModel.create(data);
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
