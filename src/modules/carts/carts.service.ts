import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CartData } from './dto/create-cart.dto'
import { UpdateCartData } from './dto/update-cart.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Cart, CartDocument } from './shemas/cart.schema'
import { Model } from 'mongoose'
import { Product, ProductDocument } from '../products/schemas/product.schema'

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  async create(data: CartData, user: string) {
    try {
      const { product, variation, quantity } = data
      let subTotal = variation.price * quantity
      const cart = await this.cartModel.findOne({ product, user, variation })
      if (cart) {
        subTotal = variation.price * (cart.quantity + quantity)
        return this.cartModel.findOneAndUpdate({ _id: cart._id }, { quantity: cart.quantity + quantity, subTotal }, { new: true })
      }
      return await this.cartModel.create({ ...data, user, subTotal })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(user: string) {
    try {
      const carts = await this.cartModel.find({ user })
        .populate([
          { path: 'user', select: '-password -codeId -codeExpired -wallet -deliveryAddresses -createdAt -updatedAt' },
          { path: 'product', select: '-createdAt -updatedAt -attributes -variations -brand -category' }
        ])
      return carts
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(_id: string) {
    try {
      const cart = await this.cartModel.findOne({ _id })
      if (!cart) throw new NotFoundException('Cart item not found')
      return cart
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(_id: string, data: UpdateCartData) {
    try {
      const { quantity } = data
      const cart = await this.cartModel.findById({ _id })
      if (!cart) throw new NotFoundException('Cart item not found')
      const subTotal = cart.variation.price * quantity
      return await this.cartModel.findOneAndUpdate({ _id }, { ...data, subTotal }, { new: true })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string | string[]) {
    try {
      if (Array.isArray(_id)) {
        const carts = await Promise.all(_id.map(id => this.cartModel.findOneAndDelete({ _id: id })))
        return carts
      } else {
        const cart = await this.cartModel.findOneAndDelete({ _id })
        if (!cart) throw new NotFoundException('Cart item not found')
        return cart
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}