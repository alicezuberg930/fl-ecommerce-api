import { Module } from '@nestjs/common';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './shemas/brand.schema';
import { FileService } from '../files/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/common/helpers/options/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [BrandController],
  providers: [BrandService, FileService],
})
export class BrandModule { }