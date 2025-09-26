import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type BrandDocument = HydratedDocument<Brand>

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: [true, "Brand name is required"] })
    name: string

    @Prop({ required: [true, "Logo is required"] })
    logo: string
}

export const BrandSchema = SchemaFactory.createForClass(Brand)