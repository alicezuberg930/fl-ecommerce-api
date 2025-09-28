import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty({ message: "Giá tiền không được để trống" })
    amount: number

    @IsNotEmpty({ message: "Phương thức thanh toán không được để trống" })
    paymentMethod: string
    
    // 
    // @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    // @Length(10, 10, { message: "Số điện thoại phải chứa đúng 10 ký tự" })
    // @Matches(/^[0-9]*$/, { message: "Số điện thoại chỉ được chứa số" })
    // phone: string

    // @IsOptional()
    // telephone: string

    // @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    // @Length(10, 10, { message: "Số điện thoại phải chứa đúng 10 ký tự" })
    // @Matches(/^[0-9]*$/, { message: "Số điện thoại chỉ được chứa số" })
    // hotline: string

    // @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    // address: string

    // @IsNotEmpty({ message: "Giờ hoạt động không được để trống" })
    // openHour: string

    // @IsOptional()
    // slogan: string

    // @IsOptional()
    // googleMap: string

    // @IsEmail({}, { message: "Email sai định dạng" })
    // email: string

    // @IsOptional()
    // zaloChatURL: string

    // @IsOptional()
    // facebookChatURL: string

    // @IsOptional()
    // facebookPage: string

    // @IsOptional()
    // googlePage: string

    // @IsOptional()
    // youtubePage: string

    // @IsNotEmpty({ message: "Thông tin footer không được để trống" })
    // footerInfo: string

    // @IsNotEmpty({ message: "Thông tin liên lạc không được trống" })
    // footerContact: JSON

    // @IsOptional()
    // fax: string

    // @IsOptional()
    // facebookID: string
}