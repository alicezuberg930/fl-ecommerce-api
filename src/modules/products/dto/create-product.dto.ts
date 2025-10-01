import { IsOptional } from "class-validator"

export class Attribute {
    @IsOptional()
    name: string

    @IsOptional()
    values: string[]
}

export class Variation {
    @IsOptional()
    sku: string

    @IsOptional()
    price: number

    @IsOptional()
    stock: number

    @IsOptional()
    attributeValues: Map<string, string>
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

    @IsOptional()
    attributes: Attribute[]

    @IsOptional()
    images: string[]
}