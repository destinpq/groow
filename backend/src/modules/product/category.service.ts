import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = this.generateSlug(createCategoryDto.name);

    // Check if parent exists
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      slug,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findAllWithHierarchy(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { parentId: null, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    for (const category of categories) {
      await this.loadChildren(category);
    }

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    // Check if category has children
    const children = await this.categoryRepository.count({
      where: { parentId: id },
    });

    if (children > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    await this.categoryRepository.delete(id);
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  private async loadChildren(category: Category): Promise<void> {
    const children = await this.categoryRepository.find({
      where: { parentId: category.id, isActive: true },
      order: { sortOrder: 'ASC' },
    });

    if (children.length > 0) {
      category['children'] = children;
      for (const child of children) {
        await this.loadChildren(child);
      }
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
