import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Brand } from './entities/brand.entity';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { ProductStatus } from '@/common/enums';
import { parsePaginationParams, calculateSkip, createPaginationResult } from '@/common/utils/pagination.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Generate slug from name
    const slug = this.generateSlug(createProductDto.name);
    
    // Check if SKU already exists
    const existingSku = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });
    
    if (existingSku) {
      throw new BadRequestException('SKU already exists');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      slug,
    });

    return this.productRepository.save(product);
  }

  async findAll(filters: ProductFilterDto) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      categoryId, 
      brandId, 
      vendorId,
      minPrice,
      maxPrice,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;
    
    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);

    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'user');

    // Search filter
    if (search) {
      query.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Category filter
    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // Brand filter
    if (brandId) {
      query.andWhere('product.brandId = :brandId', { brandId });
    }

    // Vendor filter
    if (vendorId) {
      query.andWhere('product.vendorId = :vendorId', { vendorId });
    }

    // Price range filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.andWhere('product.basePrice BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      query.andWhere('product.basePrice >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      query.andWhere('product.basePrice <= :maxPrice', { maxPrice });
    }

    // Status filter
    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    // Sorting
    query.orderBy(`product.${sortBy}`, sortOrder);

    // Pagination
    const skip = calculateSkip(pageNum, limitNum);
    query.skip(skip).take(limitNum);

    const [products, total] = await query.getManyAndCount();

    return {
      data: products,
      meta: createPaginationResult(total, pageNum, limitNum),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['vendor', 'vendor.user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    product.viewCount += 1;
    await this.productRepository.save(product);

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['vendor', 'vendor.user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softDelete(id);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Product> {
    const product = await this.findOne(id);
    product.status = status;
    
    if (status === ProductStatus.APPROVED) {
      product.publishedAt = new Date();
    }

    return this.productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQuantity = quantity;
    return this.productRepository.save(product);
  }

  async decrementStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stockQuantity -= quantity;
    return this.productRepository.save(product);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + 
      '-' + 
      Date.now().toString(36);
  }

  async getVendorProducts(vendorId: string, filters: ProductFilterDto) {
    return this.findAll({ ...filters, vendorId });
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: { 
        status: ProductStatus.APPROVED,
        isActive: true 
      },
      order: { salesCount: 'DESC' },
      take: limit,
    });
  }

  async getRecommendedProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: { 
        status: ProductStatus.APPROVED,
        isActive: true 
      },
      order: { rating: 'DESC', viewCount: 'DESC' },
      take: limit,
    });
  }
}
