import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type BannerDocument = HydratedDocument<Banner>

@Schema({ timestamps: true })
export class Banner {
    @Prop()
    order: number

    @Prop()
    image: string

    @Prop()
    name: string
}

export const BannerSchema = SchemaFactory.createForClass(Banner)