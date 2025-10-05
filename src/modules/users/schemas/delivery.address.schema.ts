import { Prop, Schema } from "@nestjs/mongoose"
import { AddressType } from "../dto/enum"

@Schema({ timestamps: false })
export class DeliveryAddress {
    @Prop({ required: [true, 'Contact name is required'] })
    contactName: string

    @Prop({ required: [true, 'Contact phone is required'] })
    contactPhone: string

    @Prop({ required: [true, 'Province is required'] })
    province: string

    @Prop({ required: [true, 'District is required'] })
    district: string

    @Prop({ required: [true, 'Ward is required'] })
    ward: string

    @Prop({ required: [true, 'Street name is required'] })
    street: string

    @Prop({ enum: AddressType, required: [true, 'Address type is invalid'] })
    addressType: string

    @Prop({ default: false })
    isDefault: boolean
}
