import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Variation } from 'src/modules/products/schemas/variation.schema'

export type CartDocument = HydratedDocument<Cart>

@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: [true, "Product ID cannot be empty"] })
    product: Types.ObjectId

    @Prop({ type: Variation, required: [true, "Variation cannot be empty"] })
    variation: Variation

    @Prop({ type: Types.ObjectId, ref: 'User', required: [true, "User ID is required"] })
    user: Types.ObjectId

    @Prop()
    quantity: number

    @Prop()
    subTotal: number
}

export const CartSchema = SchemaFactory.createForClass(Cart)