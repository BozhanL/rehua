import { CreateManualDto } from './dto/create-manual.dto';
import { MANUAL_TYPE, ManualService } from './manual.service';
import { getFilesFromRequest } from '@/utils/helpers';
import { TypedFormData, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Req,
  Header,
  StreamableFile,
  Get,
} from '@nestjs/common';
import type { Request } from 'express';
import { remove } from 'fs-extra';

@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  @TypedRoute.Post()
  async create(
    @Req() request: Request,

    // This is a workaround for the issue where Nestia SDK does not include the body in the generated client.
    // The content will be accessed in the LocalAuthGuard and TOTPAuthGuard
    @TypedFormData.Body(ManualService.getMulter) _: CreateManualDto,
  ): Promise<true> {
    const files = getFilesFromRequest(request);

    try {
      if (files.length !== 1 || files[0] === undefined) {
        throw new BadRequestException('Exactly one file must be uploaded.');
      }

      return await this.manualService.create(files[0]);
    } finally {
      await Promise.all(files.map(async (file) => remove(file.path)));
    }
  }

  /**
   * @ignore
   * @description This endpoint is used to view the manual. It is not intended to be used directly by clients in SDK.
   */
  @Get()
  @Header('Content-Type', MANUAL_TYPE)
  find(): StreamableFile {
    return this.manualService.find();
  }
}
