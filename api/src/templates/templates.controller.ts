import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './entities/template.entity';
import { TemplatesService } from './templates.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Param } from '@nestjs/common';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createTemplateDto: CreateTemplateDto,
  ): Promise<Template & { _id: string }> {
    const doc = await this.templatesService.create(createTemplateDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get(':id')
  async findOne(
    @TypedParam('id') id: string,
  ): Promise<(Template & { _id: string }) | null> {
    const doc = await this.templatesService.findOne(id);
    if (!doc) {
      return null;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }
  @TypedRoute.Get()
  async findAll(): Promise<(Template & { _id: string })[]> {
    const docs = await this.templatesService.findAll();

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @TypedRoute.Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<(Template & { _id: string }) | null> {
    const doc = await this.templatesService.remove(id);
    if (!doc) {
      return null;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }
}
