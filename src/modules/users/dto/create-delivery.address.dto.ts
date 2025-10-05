import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator'
import { AddressType } from './enum'

export class DeliveryAddress {
    @IsNotEmpty({ message: 'Contact name cannot be empty' })
    contactName: string

    @Matches(/^0\d{9}$/, { message: 'Phone number is invald' })
    contactPhone: string

    @IsNotEmpty({ message: 'Province cannot be empty' })
    province: string

    @IsNotEmpty({ message: 'District cannot be empty' })
    district: string

    @IsNotEmpty({ message: 'Ward cannot be empty' })
    ward: string

    @IsNotEmpty({ message: 'Street name cannot be empty' })
    street: string

    @IsEnum(AddressType, { message: 'Address type is invalid' })
    addressType: string

    @IsOptional()
    isDefault: boolean
}