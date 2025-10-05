import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { PaymentMethod } from '../dto/enum'
import { Variation } from 'src/modules/products/schemas/variation.schema'
import { DeliveryAddress } from 'src/modules/users/schemas/delivery.address.schema'

export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: false, _id: false })
class Item {
    @Prop({ type: Types.ObjectId, ref: 'Product' })
    product: Types.ObjectId

    @Prop()
    quantity: number

    @Prop()
    variation: Variation
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ enum: PaymentMethod, required: [true, 'Payment method is invalid'] })
    paymentMethod: string

    @Prop({ type: Variation, required: [true, 'Variation is required'] })
    variation: Variation

    @Prop({ type: Types.ObjectId, ref: 'User', required: [true, 'Rating user is required'] })
    user: Types.ObjectId

    @Prop({ required: [true, 'Sub total is required'] })
    subTotal: number

    @Prop({ required: [true, 'Total is required'] })
    total: number

    @Prop({ required: [true, 'Discount is required'] })
    discount: number

    @Prop({ required: [true, 'Shipping is required'] })
    shipping: number

    @Prop({ type: DeliveryAddress, required: [true, 'Delivery address is required'] })
    billing: DeliveryAddress

    @Prop({ type: [Item], default: [] })
    items: Item[]

    @Prop()
    payUrl: string

    @Prop()
    deeplink: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)