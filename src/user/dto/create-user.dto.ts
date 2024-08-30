
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LoginUserDto } from "./login-user.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto extends LoginUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name:string
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatar: string
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio: string
}
