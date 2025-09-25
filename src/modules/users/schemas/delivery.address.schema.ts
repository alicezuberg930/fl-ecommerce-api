import { Prop, Schema } from "@nestjs/mongoose"
import { addressTypes } from "../dto/enum"

@Schema({ timestamps: false })
export class DeliveryAddress {    
    @Prop()
    contactName: string

    @Prop()
    contactPhone: string

    @Prop()
    city: string

    @Prop()
    district: string

    @Prop()
    ward: string

    @Prop()
    street: string

    @Prop({ enum: addressTypes })
    addressType: string

    @Prop({ default: false })
    isDefault: boolean
}
