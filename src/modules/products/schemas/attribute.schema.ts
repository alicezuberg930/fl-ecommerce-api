import { Prop } from "@nestjs/mongoose"

export class Attribute {
    @Prop()
    name: string

    @Prop()
    values: string[]
}
