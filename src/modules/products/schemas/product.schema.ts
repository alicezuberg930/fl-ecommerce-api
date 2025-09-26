import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as MongooseSchema } from "mongoose"
import { category } from "../dto/enum";

export type ProductDocument = HydratedDocument<Product>

@Schema({ timestamps: true })
export class Product {
    @Prop()
    title: string;

    @Prop()
    description: string

    @Prop()
    date: string

    @Prop({ enum: category })
    category: string

    @Prop()
    cover: string

    @Prop()
    images: string[]
}

export const ProductSchema = SchemaFactory.createForClass(Product)