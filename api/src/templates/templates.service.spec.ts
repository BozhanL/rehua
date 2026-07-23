import type { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './entities/template.entity';
import { TemplatesService } from './templates.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';

const templateModelMock = {
  create: jest.fn(async (createTemplateDto: CreateTemplateDto) =>
    Promise.resolve({
      toJSON: () => createTemplateDto,
      _id: 'mockedId',
    }),
  ),
  find: jest.fn(async (createTemplateDto: CreateTemplateDto) =>
    Promise.resolve({
      toJSON: () => createTemplateDto,
      _id: 'mockedId',
    }),
  ),
  findById: jest.fn(async (createTemplateDto: CreateTemplateDto) =>
    Promise.resolve({
      toJSON: () => createTemplateDto,
      _id: 'mockedId',
    }),
  ),
  findByIdAndDelete: jest.fn(async (createTemplateDto: CreateTemplateDto) =>
    Promise.resolve({
      toJSON: () => createTemplateDto,
      _id: 'mockedId',
    }),
  ),
};

describe('templatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getModelToken(Template.name),
          useValue: templateModelMock,
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be instance of TemplatesService', () => {
    expect.assertions(1);

    expect(service).toBeInstanceOf(TemplatesService);
  });

  it('should be able to create a template', async () => {
    expect.assertions(1);

    const argument = { schema: {}, uiSchema: {} };
    await service.create(argument);

    expect(templateModelMock.create).toHaveBeenCalledWith(argument);
  });
});
