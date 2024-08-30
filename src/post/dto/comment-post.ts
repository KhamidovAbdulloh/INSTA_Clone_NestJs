import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"


export class CommentPostDto {
    id: string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    comment: string
    email: string
}