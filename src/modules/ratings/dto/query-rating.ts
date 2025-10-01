import { IsOptional } from "class-validator"

export class QueryRating {
    @IsOptional()
    page: number

    @IsOptional()
    pageSize: string

    @IsOptional()
    product: string
}