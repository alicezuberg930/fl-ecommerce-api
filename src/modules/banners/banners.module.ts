import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './shemas/banner.schema';
import { FileService } from '../files/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../common/helpers/options/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [BannersController],
  providers: [BannersService, FileService],
})
export class BannersModule { }
