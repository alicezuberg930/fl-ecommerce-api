import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './schemas/product.schema'
import { FileService } from '../files/file.service'
import { MulterModule } from '@nestjs/platform-express'
import { MulterConfigService } from 'src/common/helpers/options/multer.config'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FileService],
})
export class ProductsModule { }
