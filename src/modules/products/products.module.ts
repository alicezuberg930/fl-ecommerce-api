import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsdController } from './products.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from './schemas/product.schema'
import { FileService } from '../file/file.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
  ],
  controllers: [ProductsdController],
  providers: [ProductsService, FileService],
})
export class PostsModule { }
