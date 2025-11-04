import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rfq } from './entities/rfq.entity';
import { Quotation } from './entities/quotation.entity';
import { CreateRfqDto, CreateQuotationDto, RfqFilterDto } from './dto/rfq.dto';
import { RfqStatus } from '@/common/enums';
import { NotificationService } from '@/modules/notification/notification.service';

@Injectable()
export class RfqService {
  constructor(
    @InjectRepository(Rfq)
    private rfqRepository: Repository<Rfq>,
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    private notificationService: NotificationService,
  ) {}

  async create(customerId: string, createRfqDto: CreateRfqDto): Promise<Rfq> {
    const rfqNumber = `RFQ-${Date.now()}`;

    const rfq = this.rfqRepository.create({
      ...createRfqDto,
      customerId,
      rfqNumber,
      status: RfqStatus.OPEN,
    });

    const savedRfq = await this.rfqRepository.save(rfq);

    // TODO: Notify vendors about new RFQ

    return savedRfq;
  }

  async findAll(filters: RfqFilterDto) {
    const { page = 1, limit = 10, status, customerId } = filters;

    const query = this.rfqRepository.createQueryBuilder('rfq')
      .leftJoinAndSelect('rfq.customer', 'customer')
      .leftJoinAndSelect('rfq.quotations', 'quotations');

    if (status) {
      query.andWhere('rfq.status = :status', { status });
    }

    if (customerId) {
      query.andWhere('rfq.customerId = :customerId', { customerId });
    }

    query.orderBy('rfq.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [rfqs, total] = await query.getManyAndCount();

    return {
      data: rfqs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Rfq> {
    const rfq = await this.rfqRepository.findOne({
      where: { id },
      relations: ['customer', 'customer.user', 'quotations', 'quotations.vendor'],
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    return rfq;
  }

  async updateStatus(id: string, status: RfqStatus): Promise<Rfq> {
    const rfq = await this.findOne(id);
    rfq.status = status;
    return this.rfqRepository.save(rfq);
  }

  async getCustomerRfqs(customerId: string, filters: RfqFilterDto) {
    return this.findAll({ ...filters, customerId });
  }

  // Quotation methods
  async createQuotation(
    vendorId: string,
    createQuotationDto: CreateQuotationDto,
  ): Promise<Quotation> {
    const rfq = await this.findOne(createQuotationDto.rfqId);

    if (rfq.status === RfqStatus.CLOSED) {
      throw new BadRequestException('RFQ is closed');
    }

    const quotationNumber = `QT-${Date.now()}`;

    const quotation = this.quotationRepository.create({
      ...createQuotationDto,
      vendorId,
      quotationNumber,
      status: 'submitted',
    });

    const savedQuotation = await this.quotationRepository.save(quotation);

    // Update RFQ status
    if (rfq.status === RfqStatus.OPEN) {
      rfq.status = RfqStatus.QUOTED;
      await this.rfqRepository.save(rfq);
    }

    // TODO: Notify customer about new quotation

    return savedQuotation;
  }

  async getQuotations(rfqId: string): Promise<Quotation[]> {
    return this.quotationRepository.find({
      where: { rfqId },
      relations: ['vendor', 'vendor.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async acceptQuotation(quotationId: string, customerId: string): Promise<Quotation> {
    const quotation = await this.quotationRepository.findOne({
      where: { id: quotationId },
      relations: ['rfq'],
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (quotation.rfq.customerId !== customerId) {
      throw new BadRequestException('Unauthorized');
    }

    quotation.status = 'accepted';
    quotation.acceptedAt = new Date();

    // Update RFQ status
    const rfq = await this.findOne(quotation.rfqId);
    rfq.status = RfqStatus.ACCEPTED;
    await this.rfqRepository.save(rfq);

    // Reject other quotations
    await this.quotationRepository
      .createQueryBuilder()
      .update(Quotation)
      .set({ status: 'rejected' })
      .where('rfqId = :rfqId', { rfqId: quotation.rfqId })
      .andWhere('id != :id', { id: quotation.id })
      .execute();

    return this.quotationRepository.save(quotation);
  }

  async getVendorQuotations(vendorId: string) {
    return this.quotationRepository.find({
      where: { vendorId },
      relations: ['rfq', 'rfq.customer'],
      order: { createdAt: 'DESC' },
    });
  }
}
