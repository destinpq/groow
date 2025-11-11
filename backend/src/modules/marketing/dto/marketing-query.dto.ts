import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean, Min, Max, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;
}

// Enums based on actual entity definitions
export enum DealType {
  FLASH_SALE = 'flash_sale',
  DAILY_DEAL = 'daily_deal',
  BULK_DISCOUNT = 'bulk_discount',
  SEASONAL_SALE = 'seasonal_sale'
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
  BUY_X_GET_Y = 'buy_x_get_y'
}

export enum PromotionType {
  BANNER = 'banner',
  POPUP = 'popup',
  EMAIL_CAMPAIGN = 'email_campaign',
  SMS_CAMPAIGN = 'sms_campaign',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL_PROGRAM = 'referral_program'
}

export enum PromotionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export class GetDealsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DealType, { message: 'Invalid deal type' })
  dealType?: DealType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  createdById?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}

export class GetCouponsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CouponType, { message: 'Invalid coupon type' })
  type?: CouponType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  createdById?: string;
}

export class GetPromotionsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PromotionType, { message: 'Invalid promotion type' })
  type?: PromotionType;

  @IsOptional()
  @IsEnum(PromotionStatus, { message: 'Invalid promotion status' })
  status?: PromotionStatus;

  @IsOptional()
  @IsString()
  createdById?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsDateString()
  launchedAt?: string;
}