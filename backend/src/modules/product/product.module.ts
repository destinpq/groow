import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Brand, ProductReview])],
  controllers: [ProductController, CategoryController, BrandController],
  providers: [ProductService, CategoryService, BrandService],
  exports: [ProductService, CategoryService, BrandService],
})
export class ProductModule {}
