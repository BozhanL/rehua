import { Config } from '@/utils/config';
import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { move, createReadStream } from 'fs-extra';
import multer, { diskStorage, Multer } from 'multer';
import { join } from 'node:path';

export const MANUAL_NAME = 'manual.pdf';
export const MANUAL_TYPE = 'application/pdf';

@Injectable()
export class ManualService {
  private static multerInstance: Multer;
  public _filePath: string;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this._filePath = this.configService.getOrThrow('DATA_PATH');

    ManualService.multerInstance = multer({
      storage: diskStorage({ destination: this._filePath }),

      // TODO: update this limit
      limits: { fileSize: 7 * 1024 * 1024 },
    });
  }

  static getMulter(): multer.Multer {
    return ManualService.multerInstance;
  }

  async create(manual: Express.Multer.File): Promise<true> {
    if (manual.mimetype !== MANUAL_TYPE) {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed.',
      );
    }

    console.log(manual);

    await move(manual.path, join(this._filePath, MANUAL_NAME), {
      overwrite: true,
    });

    return true;
  }

  find(): StreamableFile {
    const file = createReadStream(join(this._filePath, MANUAL_NAME));
    return new StreamableFile(file, {
      type: MANUAL_TYPE,
      disposition: `inline; filename="${MANUAL_NAME}"`,
    });
  }
}
