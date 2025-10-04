import { IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator"
import { addressTypes } from "./enum"

export class DeliveryAddressData {
    @IsNotEmpty({ message: "Fullname cannot be empty" })
    contactName: string

    @Matches(/^0\d{9}$/, { message: 'Phone number is invald' })
    contactPhone: string

    @IsNotEmpty({ message: "Thành phố không được trống" })
    province: string

    @IsNotEmpty({ message: "Quận không được trống" })
    district: string

    @IsNotEmpty({ message: "Phường không được trống" })
    ward: string

    @IsOptional()
    street: string

    @IsEnum(addressTypes, { message: 'Address type is invalid' })
    addressType: string

    @IsOptional()
    isDefault: boolean
}

