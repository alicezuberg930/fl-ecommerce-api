import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose"
import { Variation } from "./variation.schema"
import { Attribute } from "./attribute.schema"

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: [true, "Product name are required"] })
    name: string

    @Prop({ required: [true, "Product description are required"] })
    description: string

    @Prop({ required: [true, "Product price are required"] })
    price: number

    @Prop({ required: [true, "Product images are required"] })
    images: string[]

    @Prop({ type: Types.ObjectId, ref: 'Category', required: [true, "Category ID cannot be empty"] })
    category: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Brand', required: [true, "Brand ID cannot be empty"] })
    brand: Types.ObjectId

    @Prop({ required: [true, "Product weight are required"] })
    weight: number

    @Prop({ required: [true, "Product height images are required"] })
    height: number

    @Prop({ required: [true, "Product width are required"] })
    width: number

    @Prop({ required: [true, "Product length are required"] })
    length: number

    @Prop({ default: false })
    isHidden: boolean

    // @Prop({ type: [{ type: Types.ObjectId, ref: 'Rating' }], default: [] })
    // ratings: Types.ObjectId[]

    @Prop({ type: [Attribute], default: [] })
    attributes: Attribute[]

    @Prop({ type: [Variation], default: [] })
    variations: Variation[]
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.index({ name: 1 }, { unique: false })
ProductSchema.index({ category: 1 }, { unique: false })
ProductSchema.index({ brand: 1 }, { unique: false })