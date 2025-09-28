import { Prop, Schema } from "@nestjs/mongoose"

// @Schema({ timestamps: false })
export class Attribute {
    @Prop()
    value: string

    @Prop()
    price: number

    @Prop()
    quantity: number
}
