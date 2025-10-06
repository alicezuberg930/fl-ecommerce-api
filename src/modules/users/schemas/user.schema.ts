
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Wallet } from './wallet.schema'
import { DeliveryAddress } from './delivery.address.schema'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ required: [true, "User name is requierd"] })
    name: string

    @Prop({ required: [true, "User email is requierd"] })
    email: string

    @Prop({ required: [true, "User password is requierd"] })
    password: string

    @Prop({ length: 10 })
    phone: string

    @Prop({ default: "" })
    avatar: string

    @Prop({ default: "LOCAL" })
    accountType: string

    @Prop({ default: false })
    isEmailVerified: boolean

    @Prop()
    codeId: string

    @Prop({ type: Date })
    codeExpired: Date

    @Prop({ type: Wallet, default: () => ({ balance: 0 }) })
    wallet: Wallet

    @Prop({ type: [DeliveryAddress], default: [] })
    deliveryAddresses: DeliveryAddress[]
}

export const UserSchema = SchemaFactory.createForClass(User)