import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdatePostDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    caption: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    geoLocationOfPost: string
}
