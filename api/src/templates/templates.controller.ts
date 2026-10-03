import type { CreateTemplateDto } from './dto/create-template.dto';
import * as updateStatusTemplateDto from './dto/update-status-template.dto';
import { TemplateType } from './entities/template-type.enum';
import type { Template } from './entities/template.entity';
import { TemplatesService } from './templates.service';
import { Roles } from '@/auth/roles.decorator';
import * as paginationRequestDto from '@/schema/patients/dto/pagination-request.dto';
import { PaginatedResponseDto } from '@/schema/patients/dto/pagination-response.dto';
import type { MongoId } from '@/utils/types';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Roles('admin', 'nurse')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Roles('admin')
  @TypedRoute.Post()
  async create(
    @TypedBody() createTemplateDto: CreateTemplateDto,
  ): Promise<Template & { _id: MongoId }> {
    const doc = await this.templatesService.create(createTemplateDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get('/id/:id')
  async findOne(
    @TypedParam('id') id: MongoId,
  ): Promise<(Template & { _id: MongoId }) | null> {
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

  @Roles('admin')
  @TypedRoute.Get('page/:pageNumber/:numberOfRows')
  async findPage(
    @TypedParam('numberOfRows') numberOfRows: number,
    @TypedParam('pageNumber') pageNumber: number,
    @TypedQuery() query: paginationRequestDto.PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Template & { _id: MongoId }>> {
    const { filter, search } = query;

    let paginatedResult;

    if (filter === '_id') {
      paginatedResult = await this.templatesService.findPaginatedOne(
        search ?? '',
      );
    } else if (filter === 'templateType') {
      paginatedResult = await this.templatesService.findByTypePagination(
        numberOfRows,
        pageNumber,
        search ?? '',
      );
    } else if (filter || search) {
      paginatedResult = await this.templatesService.findPageByFilter(
        numberOfRows,
        pageNumber,
        filter ?? '',
        search ?? '',
      );
    } else {
      paginatedResult = await this.templatesService.findPage(
        numberOfRows,
        pageNumber,
      );
    }

    const formattedDocs = paginatedResult.data.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));

    return {
      data: formattedDocs,
      meta: paginatedResult.meta,
    };
  }

  @TypedRoute.Get('/type/:type')
  async findTemplatesWithType(
    @TypedParam('type') type: TemplateType,
  ): Promise<(Template & { _id: MongoId })[]> {
    const docs = await this.templatesService.findByType(type);

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc,
      _id: doc._id.toString(),
    }));
  }

  @Roles('admin')
  @TypedRoute.Patch(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() updateDto: updateStatusTemplateDto.UpdateStatusDto,
  ): Promise<UpdateWriteOpResult> {
    return this.templatesService.update(id, updateDto.status);
  }
}
