import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop()
    amount: number

    @Prop()
    paymentMethod: string

    @Prop()
    payUrl: string

    @Prop()
    deeplink: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);