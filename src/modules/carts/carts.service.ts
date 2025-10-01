import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CartData } from './dto/create-cart.dto'
import { UpdateCartData } from './dto/update-cart.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Cart, CartDocument } from './shemas/cart.schema'
import { Model } from 'mongoose'
import { FileService } from '../files/file.service'

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>, private fileService: FileService) { }

  async create(data: CartData, user: string) {
    try {
      return await this.cartModel.create({ ...data, user })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      const banners = await this.cartModel.find().sort({ order: 1 })
      return banners
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(_id: number) { }

  async update(_id: string, data: UpdateCartData) {
    try {
      const banner = await this.cartModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
      if (!banner) throw new NotFoundException('Banner not found')
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string) {
    try {
      const banner = await this.cartModel.findOneAndDelete({ _id })
      if (!banner) throw new NotFoundException('Banner not found')
      return banner
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
