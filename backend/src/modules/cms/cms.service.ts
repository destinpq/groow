import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { Faq } from './entities/faq.entity';
import { Page } from './entities/page.entity';
import { CreateBannerDto, CreateFaqDto, CreatePageDto } from './dto/cms.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  // Banner Methods
  async createBanner(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async getAllBanners(): Promise<Banner[]> {
    return this.bannerRepository.find({ order: { displayOrder: 'ASC' } });
  }

  async getActiveBanners(placement?: string): Promise<Banner[]> {
    const query = this.bannerRepository.createQueryBuilder('banner')
      .where('banner.isActive = :isActive', { isActive: true });

    if (placement) {
      query.andWhere('banner.placement = :placement', { placement });
    }

    return query.orderBy('banner.displayOrder', 'ASC').getMany();
  }

  async updateBanner(id: string, updateData: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    Object.assign(banner, updateData);
    return this.bannerRepository.save(banner);
  }

  async deleteBanner(id: string): Promise<void> {
    await this.bannerRepository.delete(id);
  }

  // FAQ Methods
  async createFaq(createFaqDto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  async getAllFaqs(): Promise<Faq[]> {
    return this.faqRepository.find({ order: { displayOrder: 'ASC' } });
  }

  async getActiveFaqs(category?: string): Promise<Faq[]> {
    const query = this.faqRepository.createQueryBuilder('faq')
      .where('faq.isActive = :isActive', { isActive: true });

    if (category) {
      query.andWhere('faq.category = :category', { category });
    }

    return query.orderBy('faq.displayOrder', 'ASC').getMany();
  }

  async updateFaq(id: string, updateData: Partial<CreateFaqDto>): Promise<Faq> {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    Object.assign(faq, updateData);
    return this.faqRepository.save(faq);
  }

  async deleteFaq(id: string): Promise<void> {
    await this.faqRepository.delete(id);
  }

  // Page Methods
  async createPage(createPageDto: CreatePageDto): Promise<Page> {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  async getAllPages(): Promise<Page[]> {
    return this.pageRepository.find();
  }

  async getPageBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { slug } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  async updatePage(id: string, updateData: Partial<CreatePageDto>): Promise<Page> {
    const page = await this.pageRepository.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    Object.assign(page, updateData);
    return this.pageRepository.save(page);
  }

  async deletePage(id: string): Promise<void> {
    await this.pageRepository.delete(id);
  }
}
