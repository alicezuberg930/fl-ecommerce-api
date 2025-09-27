import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type RatingDocument = HydratedDocument<Rating>

@Schema({ timestamps: true })
export class Rating {
    @Prop({ required: [true, "Rating content is required"] })
    content: string

    @Prop({ required: [true, "Rating star is required"] })
    star: number

    @Prop({ required: false })
    images: string[]

    @Prop({ type: Types.ObjectId, ref: 'User', required: [true, "Rating user is required"] })
    user: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Product', required: [true, "Rating product is required"] })
    product: Types.ObjectId
}

export const RatingSchema = SchemaFactory.createForClass(Rating)