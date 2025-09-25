import { Module } from '@nestjs/common';
import { MGEsService } from './mges.service';
import { MGEsController } from './mges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MGE, MGESchema } from './shemas/mges.schema';
import { FileService } from '../file/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MGE.name, schema: MGESchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Directory to store files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
          callback(null, filename) // Set unique filename
        },
      }),
    })
  ],
  controllers: [MGEsController],
  providers: [MGEsService, FileService],
})
export class MGEsModule { }