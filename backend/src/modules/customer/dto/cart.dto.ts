import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  selectedAttributes?: {
    name: string;
    value: string;
  }[];
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class AddToWishlistDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
