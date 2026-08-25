import { CreateHelloDto } from './create-hello.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateHelloDto extends PartialType(CreateHelloDto) {}
