import type { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateType } from './entities/template-type.enum';
import { Template, TemplateDocument } from './entities/template.entity';
import { PaginatedResponseDto } from '@/schema/patients/dto/pagination-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, Require_id } from 'mongoose';

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

  async findPage(
    numberOfRows: number,
    pageNumber: number,
  ): Promise<PaginatedResponseDto<TemplateDocument>> {
    const docs = await this.templateModel
      .find()
      .sort({ templateName: 'asc', version: 'desc' })
      .skip((pageNumber - 1) * numberOfRows)
      .limit(numberOfRows)
      .exec();

    const totalDocuments = await this.templateModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / numberOfRows);

    return {
      data: docs,
      meta: {
        totalPages,
      },
    };
  }

  async findPageByFilter(
    numberOfRows: number,
    pageNumber: number,
    filter: string,
    search: string,
  ): Promise<PaginatedResponseDto<TemplateDocument>> {
    const searchFilter: Record<string, unknown> = {};

    if (filter && search) {
      const escapedValue = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

      searchFilter[filter] = {
        $regex: escapedValue,
        $options: 'i',
      };
    }

    const query = searchFilter as QueryFilter<TemplateDocument>;

    interface UserAggregateResult {
      data: TemplateDocument[];
      total: number;
    }

    const [result] = await this.templateModel
      .aggregate<UserAggregateResult>([
        { $match: query },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            paginatedResults: [
              { $sort: { status: -1 } },
              { $skip: (pageNumber - 1) * numberOfRows },
              { $limit: numberOfRows },
            ],
          },
        },
        {
          $project: {
            data: '$paginatedResults',
            total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          },
        },
      ])
      .exec();

    const rawData = result?.data ?? [];
    const total = result?.total ?? 0;

    // rehydrate the raw objects into full Mongoose documents, to allow contorller to add _id
    const data = rawData.map((doc) => this.templateModel.hydrate(doc));

    const totalFilteredDocuments = total;
    const totalPages = Math.ceil(totalFilteredDocuments / numberOfRows);

    return {
      data: data,
      meta: {
        totalPages,
      },
    };
  }

  async findByType(type: TemplateType): Promise<Require_id<Template>[]> {
    const docs = await this.templateModel
      .aggregate<Require_id<Template>>([
        {
          $sort: {
            templateName: 1,
            version: -1,
          },
        },
        {
          $group: {
            _id: '$templateName',
            template: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$template',
          },
        },
        {
          $match: {
            templateType: type,
          },
        },
        {
          $sort: {
            templateName: 1,
          },
        },
      ])
      .exec();

    return docs;
  }

  async remove(id: string): Promise<TemplateDocument | null> {
    return this.templateModel.findByIdAndDelete(id).exec();
  }
}
