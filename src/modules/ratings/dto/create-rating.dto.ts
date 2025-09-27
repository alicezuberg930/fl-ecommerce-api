import { IsNotEmpty } from "class-validator";

export class RatingData {
    @IsNotEmpty({ message: "Contnet rating cannot be empty" })
    content: string

    @IsNotEmpty({ message: "Star is requireed" })
    star: number

    @IsNotEmpty({ message: "Product ID cannot be empty" })
    productId: string
}
