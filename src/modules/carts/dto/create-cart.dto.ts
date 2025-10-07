import { IsNotEmpty } from "class-validator";
import { Variation } from "../../../modules/products/dto/create-product.dto";

export class CartData {
    @IsNotEmpty({ message: "Product ID cannot be empty" })
    product: string

    @IsNotEmpty()
    variation: Variation

    @IsNotEmpty({ message: "Quantity cannot be empty" })
    quantity: number
}
