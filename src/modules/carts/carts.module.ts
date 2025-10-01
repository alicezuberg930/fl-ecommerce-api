import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './shemas/cart.schema';
import { FileService } from '../files/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/common/helpers/options/multer.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    // MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule { }