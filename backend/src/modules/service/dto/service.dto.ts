import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, ValidateNested, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType, PricingModel, ServiceStatus } from '@/common/enums';

export class SeoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}

export class PortfolioItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}

export class TechnicalSpecDto {
  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class ServicePackageDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsNumber()
  @Min(1)
  deliveryTime: number;

  @IsNumber()
  @Min(0)
  revisions: number;
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsString()
  serviceCode: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsEnum(PricingModel)
  pricingModel: PricingModel;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsNumber()
  @Min(1)
  estimatedDuration: number;

  @IsString()
  durationUnit: string;

  @IsNumber()
  @Min(1)
  minOrderSize: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxConcurrentProjects?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsArray()
  servicePackages?: ServicePackageDto[];

  @IsOptional()
  @IsArray()
  technicalSpecs?: TechnicalSpecDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deliverables?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  portfolio?: PortfolioItemDto[];

  @IsOptional()
  seo?: SeoDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  responseTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableTimezones?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedLanguages?: string[];
}

export class UpdateServiceDto extends CreateServiceDto {
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class FilterServicesDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  @IsEnum(PricingModel)
  pricingModel?: PricingModel;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'rating' | 'popularity' | 'newest';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsBoolean()
  featuredOnly?: boolean;
}

export class CreateServiceReviewDto {
  @IsUUID()
  serviceId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pros?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cons?: string[];

  @IsOptional()
  @IsString()
  orderId?: string;
}