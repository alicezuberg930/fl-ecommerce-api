import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { OrderData } from './dto/create-order.dto'
import { UpdateOrderData } from './dto/update-order.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from './schemas/order.schema'
import { Model } from 'mongoose'
import { momoPayment, vnpayPayment } from '../../common/crypto'
import { Cart, CartDocument } from '../carts/shemas/cart.schema'
import { PaymentMethod, PaymentStatus } from './dto/enum'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) { }

  async create(data: OrderData, user: string) {
    try {
      const { cartIds, paymentMethod } = data
      const carts = await this.cartModel.find({ _id: { $in: cartIds } })
      const items = carts.map(cart => ({
        product: cart.product,
        quantity: cart.quantity,
        variation: cart.variation
      }))
      let order = await this.orderModel.create({ ...data, user, items })
      let response: any
      switch (paymentMethod) {
        case PaymentMethod.momo:
          response = await momoPayment({ requestId: order.id, orderId: order.id, amount: data.total, orderInfo: "Thanh toán đơn hàng" })
          order = await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response.payUrl, deeplink: response.deeplink }, { new: true })
          break
        case PaymentMethod.vnpay:
          //  requestId: order.id, orderId: order.id, amount: data.total
          response = vnpayPayment({ orderId: order.id, orderInfo: "Thanh toán đơn hàng", total: data.total })
          order = await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response }, { new: true })
          break
        case PaymentMethod.onepay:
          // const response = await onepayPayone({ requestId: order.id, orderId: order.id, amount: data.total })
          // await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response.payUrl, deeplink: response.deeplink }, { new: true })
          break
        case PaymentMethod.sepay:
          // const response = await sepayPayment({ requestId: order.id, orderId: order.id, amount: data.total })
          // await this.orderModel.findByIdAndUpdate(order.id, { payUrl: response.payUrl, deeplink: response.deeplink }, { new: true })
          break
        case PaymentMethod.cash:
          break
      }
      return order
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findAll() {
    try {
      const orders = this.orderModel.find()
      return orders
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(_id: string) {
    try {
      const order = this.orderModel.findOne({ _id })
      if (!order) throw new NotFoundException('Order not found')
      return order
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  update(_id: string, data: UpdateOrderData) {
    try {
      switch (data.paymentMethod) {
        case PaymentMethod.vnpay:
          break
        case PaymentMethod.momo:
          break
        case PaymentMethod.sepay:
          break
        case PaymentMethod.onepay:
          break
        case PaymentMethod.cash:
          break
      }
      const order = this.orderModel.findOneAndUpdate({ _id }, { ...data, paymentStatus: PaymentStatus.paid })
      if (!order) throw new NotFoundException('Order not found')
      return order
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(_id: string) {
    try {
      const order = await this.orderModel.findOneAndDelete({ _id })
      if (!order) throw new NotFoundException('Order not found')
      return order
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
