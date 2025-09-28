import { IsOptional } from "class-validator"

class Attribute {
    @IsOptional()
    value: string

    @IsOptional()
    price: number

    @IsOptional()
    quantity: number
}

class Variation {
    @IsOptional()
    name: string

    @IsOptional()
    attributes: Attribute[]
}

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

    @IsOptional()
    variations: Variation[]
}