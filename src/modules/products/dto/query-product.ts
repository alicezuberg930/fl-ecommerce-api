import { IsOptional } from "class-validator"

export class QueryProduct {
    @IsOptional()
    category: string

    @IsOptional()
    page: number

    @IsOptional()
    pageSize: string

    @IsOptional()
    name: string
}
