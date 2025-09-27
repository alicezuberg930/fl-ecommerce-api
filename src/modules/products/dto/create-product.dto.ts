import { IsEnum, IsOptional } from "class-validator"
import { category } from "./enum"

export class ProductData {
    @IsOptional()
    name: string

    @IsOptional()
    description: string

    @IsOptional()
    price: string

    @IsOptional()
    category: string

    @IsOptional()
    brand: string

    @IsOptional()
    weight: number

    @IsOptional()
    height: number

    @IsOptional()
    width: number

    @IsOptional()
    length: number

}
