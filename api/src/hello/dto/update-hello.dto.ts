import { CreateHelloDto } from './create-hello.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateHelloDto extends PartialType(CreateHelloDto) {}
