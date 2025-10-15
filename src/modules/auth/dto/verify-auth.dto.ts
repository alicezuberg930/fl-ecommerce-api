import { IsNotEmpty } from "class-validator"

export class VerifyData {
    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    codeId: string
}
