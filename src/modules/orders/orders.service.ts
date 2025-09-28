import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import axios, { isAxiosError } from 'axios'
import crypto from 'crypto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from './schemas/order.schema'
import { Model } from 'mongoose'
import { momoPayment } from 'src/common/utils'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      let order = await this.orderModel.create({ ...createOrderDto })
      if (createOrderDto.paymentMethod == "momo") {
        const response = await momoPayment({ requestId: order.id, orderId: order.id, amount: createOrderDto.amount })
        order = await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response.payUrl, deeplink: response.deeplink }, { new: true })
        return order
      }
    } catch (error) {
      if (isAxiosError(error)) {
        throw new BadRequestException(error.response.data)
      } else {
        throw new BadRequestException(JSON.stringify(error))
      }
    }
  }

  findAll() {
    const orders = this.orderModel.find()
    return orders
  }

  findOne(id: number) {
    return `This action returns a #${id} order`
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`
  }

  remove(id: number) {
    return this.orderModel.deleteMany()
  }
}
