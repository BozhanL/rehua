import { Hello, HelloSchema } from './entities/hello.entity';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hello.name, schema: HelloSchema }]),
  ],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
