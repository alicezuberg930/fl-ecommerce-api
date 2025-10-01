import { PartialType } from '@nestjs/mapped-types'
import { CartData } from './create-cart.dto'

export class UpdateCartData extends PartialType(CartData) { }
