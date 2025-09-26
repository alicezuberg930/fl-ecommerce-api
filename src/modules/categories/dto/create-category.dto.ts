import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCategoryData {
    @IsNotEmpty({ message: "Category name cannot be empty" })
    name: string

    @IsOptional()
    description: string

    @IsNotEmpty({ message: "Logo cannot be empty" })
    logo: string

    @IsOptional()
    parentCategoryId: string
}