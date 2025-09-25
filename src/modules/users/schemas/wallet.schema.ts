import { Prop } from "@nestjs/mongoose"

export class Wallet {
    @Prop({ default: 0 })
    balance: number
}
