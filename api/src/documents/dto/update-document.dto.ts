import {
  CreateFileDocumentDto,
  CreateFormDocumentDto,
} from './create-document.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateFileDocumentDto extends PartialType(CreateFileDocumentDto) {}
export class UpdateFormDocumentDto extends PartialType(CreateFormDocumentDto) {}
