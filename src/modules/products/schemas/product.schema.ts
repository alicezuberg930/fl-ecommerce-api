import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose"

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: [true, "Product name are required"] })
    name: string

    @Prop({ required: [true, "Product description are required"] })
    description: string

    @Prop({ required: [true, "Product price are required"] })
    price: string

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

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Rating' }], default: [] })
    ratings: Types.ObjectId[]

    // @Prop()
    // variations: {
    //     name: string
    //     attributes: {
    //         value: string
    //         quantity: number
    //         price: number
    //         // image: string
    //     }[]
    // }[]

}

export const ProductSchema = SchemaFactory.createForClass(Product)