import { Prop } from "@nestjs/mongoose"

export class Variation {
    @Prop({ unique: true })
    sku: string

    @Prop({ type: Map, of: String })
    attributeValues: Map<string, string>

    @Prop()
    price: number

    @Prop()
    stock: number
    // image: string
}
