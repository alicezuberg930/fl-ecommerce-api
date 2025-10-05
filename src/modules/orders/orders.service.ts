import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderData } from './dto/create-order.dto'
import { UpdateOrderData } from './dto/update-order.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from './schemas/order.schema'
import { Model } from 'mongoose'
import { momoPayment } from 'src/common/utils'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

  async create(data: OrderData, user: string) {
    console.log(data)
    try {
      // let order = await this.orderModel.create({ ...data, user })
      // if (data.paymentMethod == "momo") {
      //   const response = await momoPayment({ requestId: order.id, orderId: order.id, amount: data.total })
      //   order = await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response.payUrl, deeplink: response.deeplink }, { new: true })
      // return order
      // }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findAll() {
    const orders = this.orderModel.find()
    return orders
  }

  findOne(id: number) {
    return `This action returns a #${id} order`
  }

  update(id: number, data: UpdateOrderData) {
    return `This action updates a #${id} order`
  }

  remove(id: number) {
    return this.orderModel.deleteMany()
  }
}
