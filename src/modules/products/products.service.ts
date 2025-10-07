import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { Model, Types } from 'mongoose'
import { ProductData } from './dto/create-product.dto'
import { UpdateProductData } from './dto/update-product.dto'
import { QueryProduct } from './dto/query-product'
import { FileService } from '../files/file.service'

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>, private fileService: FileService) { }

  async create(data: ProductData, files: Express.Multer.File[]) {
    try {
      let images: string | string[] = []
      if (files && files.length > 0) images = await this.fileService.upload(files, 'products')
      const product = await this.productModel.create({ ...data, images })
      return product
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(query: QueryProduct) {
    try {
      const currentPage: number = +(query.page ?? 1)
      const pageSize: number = +(query.pageSize ?? 10)
      const skip = (currentPage - 1) * pageSize
      const filter: Record<string, any> = {}
      const validKeys: (keyof QueryProduct)[] = ['name', 'category', 'brand', 'isHidden']
      for (const key of validKeys) {
        if (query[key] !== undefined && query[key] !== null) {
          // if (['category', 'brand'].includes(key)) {
          //   if (Types.ObjectId.isValid(query[key] as string)) {
          //     filter[key] = new Types.ObjectId(query[key] as string);
          //   }
          // } else {
          filter[key] = query[key]
          // }
        }
      }
      const totalProducts = await this.productModel.countDocuments(filter)
      const totalPages = Math.ceil(totalProducts / pageSize)
      const products = await this.productModel.find(filter)
        .populate([
          {
            path: 'brand',
            select: '-createdAt -updatedAt'
          },
          {
            path: 'category',
            select: '-parentCategoryId -subCategories -createdAt -updatedAt'
          }]
        )
        .select(['-attributes', '-variations'])
        .limit(pageSize).skip(skip)
      return {
        data: products,
        paginate: {
          totalPages,
          pageSize,
          currentPage
        }
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(_id: string) {
    try {
      let product = await this.productModel.findById({ _id }).populate([
        {
          path: 'brand',
          select: '-createdAt -updatedAt'
        },
        {
          path: 'category',
          select: '-parentCategoryId -subCategories -createdAt -updatedAt'
        }]
      )
      if (!product) throw new NotFoundException('Product not found')
      return product
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(_id: string, data: UpdateProductData, files: Express.Multer.File[]) {
    try {
      const product = await this.productModel.findById({ _id })
      if (!product) throw new NotFoundException('Product not found')
      let images: string | string[] = []
      if (files && files.length > 0) {
        images = await this.fileService.upload(files, 'products')
        await this.fileService.delete(product.images)
      }
      images = images.length > 0 ? images : product.images
      return await this.productModel.findByIdAndUpdate({ _id }, { ...data, images }, { new: true })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(_id: string) {
    try {
      const product = await this.productModel.findOneAndDelete({ _id })
      if (!product) throw new NotFoundException('Product not found')
      await this.fileService.delete(product.images)
      return product
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}