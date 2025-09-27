import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: [true, "Category name must not be empty"] })
    name: string;

    @Prop({ required: [true, "Category logo must not be empty"] })
    logo: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parentCategoryId: Types.ObjectId | null;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
    subCategories: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);