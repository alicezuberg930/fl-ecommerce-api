import { IsNotEmpty, IsOptional } from "class-validator";

export class BannerData {
    @IsNotEmpty({ message: "Thứ tự banner không được để trống" })
    order: number

    @IsOptional()
    image: string

    @IsOptional()
    name: string
}
