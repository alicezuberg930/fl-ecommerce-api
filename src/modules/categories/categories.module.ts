import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileService } from '../files/file.service'
import { Category, CategorySchema } from './shemas/category.schema'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { MulterConfigService } from 'src/common/helpers/options/multer.config'
import { MulterModule } from '@nestjs/platform-express'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, FileService],
})
export class CategoriesModule { }
