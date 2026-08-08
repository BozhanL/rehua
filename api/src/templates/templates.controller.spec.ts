import type { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './entities/template.entity';
import { TemplatesController } from './templates.controller';
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

describe('templatesController', () => {
  let controller: TemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        TemplatesService,
        {
          provide: getModelToken(Template.name),
          useValue: templateModelMock,
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
  });

  it('should be instance of TemplatesController', () => {
    expect.assertions(1);

    expect(controller).toBeInstanceOf(TemplatesController);
  });

  it('should be able to create a template', async () => {
    expect.assertions(2);

    const argument = { schema: {}, uiSchema: {} };
    const result = await controller.create(argument);

    expect(templateModelMock.create).toHaveBeenCalledWith(argument);
    expect(result).toStrictEqual({ ...argument, _id: 'mockedId' });
  });
});
