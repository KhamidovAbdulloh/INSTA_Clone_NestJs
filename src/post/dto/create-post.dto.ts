import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { UpdatePostDto } from "./update-post.dto"

export class CreatePostDto extends UpdatePostDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    image: string
}
