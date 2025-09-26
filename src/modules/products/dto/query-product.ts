import { IsOptional } from "class-validator"

export class QueryProduct {
    @IsOptional()
    page: number

    @IsOptional()
    pageSize: string

    @IsOptional()
    name: string

    @IsOptional()
    category: string

    @IsOptional()
    brand: string
}