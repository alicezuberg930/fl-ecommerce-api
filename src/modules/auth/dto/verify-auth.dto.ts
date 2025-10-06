import { IsNotEmpty } from "class-validator"

export class VerifyDto {
    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    codeId: string
}
