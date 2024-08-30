import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string
}
