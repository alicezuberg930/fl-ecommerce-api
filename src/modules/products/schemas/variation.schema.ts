import { Prop, Schema } from "@nestjs/mongoose"
import { Attribute } from "./attribute.schema"

// @Schema({ timestamps: false })
export class Variation {
    @Prop()
    name: string

    @Prop({ type: [Attribute], default: [] })
    attributes: Attribute[]
}
