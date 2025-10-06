import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator'
import { PaymentMethod } from './enum'
import { DeliveryAddress } from 'src/modules/users/dto/create-delivery.address.dto'

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

    @IsNotEmpty({ message: 'Cart items cannot be empty' })
    cartIds: string[]
}