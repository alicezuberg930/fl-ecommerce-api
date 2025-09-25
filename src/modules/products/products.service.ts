import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post, PostDocument } from './schemas/product.schema'
import { Model, Types } from 'mongoose'
import { PostData } from './dto/create-product.dto'
import { UpdatePostData } from './dto/update-product.dto'
import { QueryProduct } from './dto/query-product'
import { FileService } from '../file/file.service'

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Post.name) private productModel: Model<PostDocument>, private fileService: FileService) { }

  async create(postData: PostData) {
    try {
      const post = await this.productModel.create({ ...postData })
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(query: QueryProduct) {
    try {
      const page: number = +(query.page ?? 1)
      const pageSize: number = +(query.pageSize ?? 10)
      const skip = (page - 1) * pageSize
      // filter options
      const filter: Record<string, any> = {}
      if (query.name) filter.name = query.name
      const totalProducts = await this.productModel.countDocuments(filter)
      const totalPages = Math.ceil(totalProducts / pageSize)
      const products = await this.productModel.find(filter).limit(pageSize).skip(skip)
      return {
        data: products,
        paginate: {
          totalPages,
          pageSize,
          currentPage: page
        }
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let post = await this.productModel.findById(id)
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, postData: UpdatePostData) {
    try {
      const post = await this.productModel.findOne({ _id: id })
      await this.fileService.delete([...post.images, post.cover])
      await post.updateOne({ ...postData }, { new: true })
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      const post = await this.productModel.findOneAndDelete({ _id: id })
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      await this.fileService.delete([...post.images, post.cover])
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}