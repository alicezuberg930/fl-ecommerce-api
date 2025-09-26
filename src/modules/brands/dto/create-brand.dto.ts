import { IsNotEmpty, IsOptional } from "class-validator";

export class BrandData {
    @IsNotEmpty({ message: "Brand name cannot be empty" })
    name: string
}
