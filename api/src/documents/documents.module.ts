import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import {
  FileDocument,
  FileDocumentSchema,
  FormDocument,
  FormDocumentSchema,
} from './entities/document.entity';
import { PatientModule } from '@/schema/patients/patient.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    PatientModule,
    MongooseModule.forFeature([
      { name: FileDocument.name, schema: FileDocumentSchema },
      { name: FormDocument.name, schema: FormDocumentSchema },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
