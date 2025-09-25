import { IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator"
import { addressTypes } from "./enum"
import { Types } from "mongoose"

export class DeliveryAddressDto {
    @IsNotEmpty({ message: "Họ tên không được trống" })
    contactName: string

    @Matches(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ' })
    contactPhone: string

    @IsNotEmpty({ message: "Thành phố không được trống" })
    city: string

    @IsNotEmpty({ message: "Quận không được trống" })
    district: string

    @IsNotEmpty({ message: "Phường không được trống" })
    ward: string

    @IsOptional()
    street: string

    @IsEnum(addressTypes, { message: 'Loại địa chỉ không hợp lệ' })
    addressType: string

    @IsOptional()
    isDefault: boolean
}

