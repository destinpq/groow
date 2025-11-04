import { IsString, IsArray, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class RfqItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specifications?: string;
}

export class CreateRfqDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [RfqItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RfqItemDto)
  items: RfqItemDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetPrice?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deliveryLocation?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  requiredBy?: string;
}

export class CreateQuotationDto {
  @ApiProperty()
  @IsString()
  rfqId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({ type: [Object] })
  @IsArray()
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  validityDays?: number;
}

export class RfqFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}
