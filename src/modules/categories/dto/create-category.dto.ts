import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryData {
    @IsNotEmpty({ message: "Category name cannot be empty" })
    name: string

    @IsOptional()
    description: string

    @IsOptional()
    parentCategoryId: string
}