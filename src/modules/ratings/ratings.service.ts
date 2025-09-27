import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { RatingData } from './dto/create-rating.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Rating, RatingDocument } from './shemas/rating.schema'
import { Model, Types } from 'mongoose'
import { FileService } from '../files/file.service'
import { Product, ProductDocument } from '../products/schemas/product.schema'

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private fileService: FileService
  ) { }

  async create(data: RatingData, files: Express.Multer.File[], user: string) {
    try {
      if (data.star > 5) throw new BadRequestException('Star cannot be higher than 5')
      let images: string | string[] = []
      if (files) images = await this.fileService.upload(files, 'ratings')
      const rating = await this.ratingModel.create({ ...data, images, product: data.productId, user })
      if (!Types.ObjectId.isValid(data.productId)) throw new Error('Invalid productId')
      await this.productModel.updateOne({ _id: data.productId }, { $push: { ratings: rating._id } })
      return rating
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const ratings = await this.ratingModel.find().populate([
        { path: 'user', select: '-password -accountType -isEmailVerified -codeId -codeExpired -wallet -deliveryAddresses -createdAt -updatedAt' },
        { path: 'product', select: '-createdAt -updatedAt' }
      ])
      return ratings
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(_id: string) {
    try {
      const rating = await this.ratingModel.findOne({ _id })
      if (!rating) throw new NotFoundException('Rating not found')
      return rating
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(_id: string, data: RatingData, files: Express.Multer.File[]) {
    try {
      const rating = await this.ratingModel.findById({ _id })
      if (!rating) throw new NotFoundException('Rating not found')
      await this.fileService.delete(rating.images)
      let images: string | string[] = []
      if (files) images = await this.fileService.upload(files, 'ratings')
      const updatedRating = await this.ratingModel.findByIdAndUpdate({ _id }, { ...data, images }, { new: true })
      return updatedRating
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string) {
    try {
      const rating = await this.ratingModel.findOneAndDelete({ _id })
      if (!rating) throw new NotFoundException('Brand not found')
      await this.fileService.delete(rating.images)
      return rating
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
