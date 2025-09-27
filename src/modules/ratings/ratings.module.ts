import { Module } from '@nestjs/common';
import { RatingService } from './ratings.service';
import { RatingController } from './ratings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './shemas/rating.schema';
import { FileService } from '../files/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/common/helpers/options/multer.config';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [RatingController],
  providers: [RatingService, FileService],
})
export class RatingModule { }