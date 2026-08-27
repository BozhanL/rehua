import { ManualController } from './manual.controller';
import { ManualService } from './manual.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ManualController],
  providers: [ManualService],
})
export class ManualModule {}
