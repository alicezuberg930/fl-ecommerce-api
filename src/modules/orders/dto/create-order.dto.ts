import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator'
import { PaymentMethod } from './enum'
import { Variation } from 'src/modules/products/dto/create-product.dto'
import { DeliveryAddress } from 'src/modules/users/dto/create-delivery.address.dto'
import { Type } from 'class-transformer'

class CartItem {
    @IsNotEmpty({ message: 'Cart ID cannot be empty' })
    cartId: string

    @IsNotEmpty({ message: 'Product ID cannot be empty' })
    productId: string

    @IsNotEmpty({ message: 'Quantity cannot be empty' })
    quantity: number

    @IsNotEmpty({ message: 'Variation cannot be empty' })
    variation: Variation
}

export class OrderData {
    @IsEnum(PaymentMethod, { message: 'Payment method is invalid' })
    paymentMethod: string

    @IsNotEmpty({ message: 'Sub total cannot be empty' })
    subTotal: number

    @IsNotEmpty({ message: 'Total cannot be empty' })
    total: number

    @IsNotEmpty({ message: 'Discount cannot be empty' })
    discount: number

    @IsNotEmpty({ message: 'Shipping cannot be empty' })
    shipping: number

    @IsNotEmpty({ message: 'Delivery address cannot be empty' })
    billing: DeliveryAddress

    @ValidateNested({ each: true })
    @Type(() => CartItem)
    @IsNotEmpty({ message: 'Cart items cannot be empty' })
    items: CartItem[]
}