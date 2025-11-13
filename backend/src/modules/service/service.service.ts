import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Between } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceReview } from './entities/service-review.entity';
import { CreateServiceDto, UpdateServiceDto, CreateServiceReviewDto, FilterServicesDto } from './dto/service.dto';
import { ServiceStatus } from '@/common/enums';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(ServiceReview)
    private reviewRepository: Repository<ServiceReview>,
  ) {}

  async create(createServiceDto: CreateServiceDto, vendorId: string): Promise<Service> {
    // Check if service code already exists
    const existingService = await this.serviceRepository.findOne({
      where: { serviceCode: createServiceDto.serviceCode }
    });
    
    if (existingService) {
      throw new ConflictException('Service code already exists');
    }

    const service = this.serviceRepository.create({
      ...createServiceDto,
      vendorId,
      publishedAt: new Date(),
    });

    return this.serviceRepository.save(service);
  }

  async findAll(filters?: FilterServicesDto): Promise<{ data: Service[], total: number }> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.vendor', 'vendor')
      .where('service.isActive = :isActive', { isActive: true })
      .andWhere('service.status = :status', { status: ServiceStatus.ACTIVE });

    // Apply filters
    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
      }

      if (filters.subcategoryId) {
        queryBuilder.andWhere('service.subcategoryId = :subcategoryId', { subcategoryId: filters.subcategoryId });
      }

      if (filters.serviceType) {
        queryBuilder.andWhere('service.serviceType = :serviceType', { serviceType: filters.serviceType });
      }

      if (filters.pricingModel) {
        queryBuilder.andWhere('service.pricingModel = :pricingModel', { pricingModel: filters.pricingModel });
      }

      if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice >= :minPrice', { minPrice: filters.minPrice });
      }

      if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('service.basePrice <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters.minRating !== undefined) {
        queryBuilder.andWhere('service.rating >= :minRating', { minRating: filters.minRating });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(service.name ILIKE :search OR service.description ILIKE :search OR service.shortDescription ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      if (filters.featuredOnly) {
        queryBuilder.andWhere('service.isFeatured = :featured', { featured: true });
      }

      // Sorting
      if (filters.sortBy) {
        const sortOrder = filters.sortOrder || 'DESC';
        switch (filters.sortBy) {
          case 'price':
            queryBuilder.orderBy('service.basePrice', sortOrder);
            break;
          case 'rating':
            queryBuilder.orderBy('service.rating', sortOrder);
            break;
          case 'popularity':
            queryBuilder.orderBy('service.ordersCompleted', sortOrder);
            break;
          case 'newest':
            queryBuilder.orderBy('service.createdAt', sortOrder);
            break;
        }
      } else {
        queryBuilder.orderBy('service.isFeatured', 'DESC')
                   .addOrderBy('service.rating', 'DESC');
      }
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Increment view count
    await this.serviceRepository.increment({ id }, 'viewCount', 1);

    return service;
  }

  async findBySlug(slug: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { slug, isActive: true },
      relations: ['vendor'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Increment view count
    await this.serviceRepository.increment({ id: service.id }, 'viewCount', 1);

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, vendorId: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id, vendorId }
    });

    if (!service) {
      throw new NotFoundException('Service not found or access denied');
    }

    // Check if service code is being changed and if it's unique
    if (updateServiceDto.serviceCode && updateServiceDto.serviceCode !== service.serviceCode) {
      const existingService = await this.serviceRepository.findOne({
        where: { serviceCode: updateServiceDto.serviceCode }
      });
      
      if (existingService) {
        throw new ConflictException('Service code already exists');
      }
    }

    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string, vendorId: string): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id, vendorId }
    });

    if (!service) {
      throw new NotFoundException('Service not found or access denied');
    }

    await this.serviceRepository.remove(service);
  }

  async getServicesByVendor(vendorId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { vendorId },
      order: { createdAt: 'DESC' }
    });
  }

  async getFeaturedServices(limit: number = 10): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { 
        isFeatured: true, 
        isActive: true,
        status: ServiceStatus.ACTIVE 
      },
      relations: ['vendor'],
      order: { rating: 'DESC' },
      take: limit
    });
  }

  // Review methods
  async createReview(createReviewDto: CreateServiceReviewDto, customerId: string): Promise<ServiceReview> {
    const service = await this.findOne(createReviewDto.serviceId);
    
    const review = this.reviewRepository.create({
      ...createReviewDto,
      customerId,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update service rating and review count
    await this.updateServiceRating(createReviewDto.serviceId);

    return savedReview;
  }

  async getServiceReviews(serviceId: string): Promise<ServiceReview[]> {
    return this.reviewRepository.find({
      where: { serviceId, isActive: true },
      relations: ['customer'],
      order: { createdAt: 'DESC' }
    });
  }

  private async updateServiceRating(serviceId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { serviceId, isActive: true }
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.serviceRepository.update(serviceId, {
      rating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
      reviewCount: reviews.length
    });
  }

  async getServiceStats(vendorId?: string): Promise<any> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service');
    
    if (vendorId) {
      queryBuilder.where('service.vendorId = :vendorId', { vendorId });
    }

    const [
      totalServices,
      activeServices,
      draftServices,
      totalViews,
      totalOrders
    ] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().where('service.status = :status', { status: ServiceStatus.ACTIVE }).getCount(),
      queryBuilder.clone().where('service.status = :status', { status: ServiceStatus.DRAFT }).getCount(),
      queryBuilder.clone().select('SUM(service.viewCount)', 'sum').getRawOne().then(result => result.sum || 0),
      queryBuilder.clone().select('SUM(service.ordersCompleted)', 'sum').getRawOne().then(result => result.sum || 0),
    ]);

    return {
      totalServices,
      activeServices,
      draftServices,
      totalViews,
      totalOrders
    };
  }
}