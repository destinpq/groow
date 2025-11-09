import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { Staff } from '@/modules/staff/entities/staff.entity';
import { NotificationService } from '@/modules/notification/notification.service';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
    @InjectRepository(TicketMessage)
    private messageRepository: Repository<TicketMessage>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private notificationService: NotificationService,
  ) {}

  // Support Center - Ticket Management (REQ-075)
  async getAllTickets(filters: any) {
    const { page, limit, status, priority, category, assignedTo, search } = filters;
    
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignedTo.user', 'staffUser');

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('ticket.priority = :priority', { priority });
    }

    if (category) {
      queryBuilder.andWhere('ticket.category = :category', { category });
    }

    if (assignedTo) {
      queryBuilder.andWhere('ticket.assignedToId = :assignedTo', { assignedTo });
    }

    if (search) {
      queryBuilder.andWhere(
        '(ticket.subject LIKE :search OR ticket.description LIKE :search OR ticket.ticketNumber LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [tickets, total] = await queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerTickets(customerId: string, filters: any) {
    const { page, limit, status } = filters;
    
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignedTo.user', 'staffUser')
      .where('ticket.customerId = :customerId', { customerId });

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    const [tickets, total] = await queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStaffTickets(staffUserId: string, filters: any) {
    // Find staff record by user ID
    const staff = await this.staffRepository.findOne({
      where: { userId: staffUserId },
    });

    if (!staff) {
      throw new NotFoundException('Staff record not found');
    }

    const { page, limit, status } = filters;
    
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer')
      .where('ticket.assignedToId = :staffId', { staffId: staff.id });

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    const [tickets, total] = await queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: tickets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createTicket(customerId: string, ticketData: any, attachments?: Express.Multer.File[]) {
    // Generate unique ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const attachmentData = attachments?.map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      filename: file.originalname,
      url: `/uploads/support/${file.filename}`, // TODO: Handle actual file upload
      uploadedAt: new Date().toISOString(),
    })) || [];

    const ticket = this.ticketRepository.create({
      ticketNumber,
      customerId,
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority,
      status: 'open',
      orderId: ticketData.orderId,
      attachments: attachmentData,
    });

    await this.ticketRepository.save(ticket);

    // Auto-assign based on category and workload
    await this.autoAssignTicket(ticket.id);

    // Send notifications
    await this.notificationService.sendPushNotification(
      customerId,
      'Support Ticket Created',
      `Your ticket ${ticketNumber} has been created successfully`
    );

    return {
      success: true,
      data: ticket,
      message: 'Support ticket created successfully',
    };
  }

  async getTicketById(ticketId: string, userId: string, userRole: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['customer', 'assignedTo', 'assignedTo.user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check permissions
    if (userRole === 'customer' && ticket.customerId !== userId) {
      throw new ForbiddenException('You can only view your own tickets');
    }

    if (userRole === 'staff') {
      const staff = await this.staffRepository.findOne({ where: { userId } });
      if (staff && ticket.assignedToId !== staff.id) {
        throw new ForbiddenException('You can only view tickets assigned to you');
      }
    }

    return {
      success: true,
      data: ticket,
    };
  }

  async assignTicket(ticketId: string, assignedToId: string, assignedBy: string, notes?: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const staff = await this.staffRepository.findOne({ where: { id: assignedToId } });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    ticket.assignedToId = assignedToId;
    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await this.ticketRepository.save(ticket);

    // Create assignment message
    await this.sendTicketMessage(
      ticketId,
      assignedBy,
      'staff',
      {
        message: `Ticket assigned to ${staff.user?.firstName} ${staff.user?.lastName}. ${notes || ''}`,
        isInternal: true,
      }
    );

    // Send notification to assigned staff
    await this.notificationService.sendPushNotification(
      staff.userId,
      'New Ticket Assignment',
      `You have been assigned ticket ${ticket.ticketNumber}`
    );

    return {
      success: true,
      data: ticket,
      message: 'Ticket assigned successfully',
    };
  }

  async updateTicketStatus(ticketId: string, statusData: any, updatedBy: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const oldStatus = ticket.status;
    ticket.status = statusData.status;

    if (statusData.resolution) {
      ticket.resolution = statusData.resolution;
    }

    if (statusData.internalNotes) {
      ticket.internalNotes = statusData.internalNotes;
    }

    if (statusData.status === 'resolved') {
      ticket.resolvedAt = new Date();
      
      if (!ticket.firstResponseAt) {
        ticket.firstResponseAt = new Date();
      }
    }

    if (statusData.status === 'closed') {
      ticket.closedAt = new Date();
    }

    await this.ticketRepository.save(ticket);

    // Create status update message
    await this.sendTicketMessage(
      ticketId,
      updatedBy,
      'staff',
      {
        message: `Ticket status changed from ${oldStatus} to ${statusData.status}${statusData.resolution ? '. Resolution: ' + statusData.resolution : ''}`,
        isInternal: false,
      }
    );

    // Send notification to customer
    await this.notificationService.sendPushNotification(
      ticket.customerId,
      'Ticket Status Updated',
      `Your ticket ${ticket.ticketNumber} status has been updated to ${statusData.status}`
    );

    return {
      success: true,
      data: ticket,
      message: 'Ticket status updated successfully',
    };
  }

  async escalateTicket(ticketId: string, reason: string, escalatedBy: string, escalateToId?: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    ticket.escalation = {
      isEscalated: true,
      escalatedAt: new Date().toISOString(),
      escalatedBy,
      escalationReason: reason,
    };

    ticket.priority = 'urgent'; // Escalated tickets are high priority

    if (escalateToId) {
      ticket.assignedToId = escalateToId;
    }

    await this.ticketRepository.save(ticket);

    // Create escalation message
    await this.sendTicketMessage(
      ticketId,
      escalatedBy,
      'staff',
      {
        message: `Ticket escalated. Reason: ${reason}`,
        isInternal: true,
      }
    );

    return {
      success: true,
      data: ticket,
      message: 'Ticket escalated successfully',
    };
  }

  async sendTicketMessage(ticketId: string, senderId: string, senderType: string, messageData: any, attachments?: Express.Multer.File[]) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const attachmentData = attachments?.map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      filename: file.originalname,
      url: `/uploads/support/${file.filename}`,
      size: file.size,
    })) || [];

    const message = this.messageRepository.create({
      ticketId,
      senderId,
      senderType,
      message: messageData.message,
      attachments: attachmentData,
      isInternal: messageData.isInternal || false,
    });

    await this.messageRepository.save(message);

    // Update ticket first response time
    if (!ticket.firstResponseAt && senderType === 'staff' && !messageData.isInternal) {
      ticket.firstResponseAt = new Date();
      await this.ticketRepository.save(ticket);
    }

    // Send notification to relevant parties
    if (!messageData.isInternal) {
      if (senderType === 'customer') {
        // Notify assigned staff
        if (ticket.assignedToId) {
          const staff = await this.staffRepository.findOne({ 
            where: { id: ticket.assignedToId },
            relations: ['user']
          });
          if (staff) {
            await this.notificationService.sendPushNotification(
              staff.userId,
              'New Ticket Message',
              `New message on ticket ${ticket.ticketNumber}`
            );
          }
        }
      } else {
        // Notify customer
        await this.notificationService.sendPushNotification(
          ticket.customerId,
          'Ticket Response',
          `You have a new response on ticket ${ticket.ticketNumber}`
        );
      }
    }

    return {
      success: true,
      data: message,
      message: 'Message sent successfully',
    };
  }

  async getTicketMessages(ticketId: string, userRole: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const queryBuilder = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.ticketId = :ticketId', { ticketId });

    // Hide internal messages from customers
    if (userRole === 'customer') {
      queryBuilder.andWhere('message.isInternal = :isInternal', { isInternal: false });
    }

    const messages = await queryBuilder
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return {
      success: true,
      data: messages,
    };
  }

  async submitFeedback(ticketId: string, customerId: string, rating: number, feedback: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.customerId !== customerId) {
      throw new ForbiddenException('You can only provide feedback for your own tickets');
    }

    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      throw new BadRequestException('You can only provide feedback for resolved or closed tickets');
    }

    ticket.customerRating = rating;
    ticket.customerFeedback = feedback;

    await this.ticketRepository.save(ticket);

    return {
      success: true,
      data: ticket,
      message: 'Feedback submitted successfully',
    };
  }

  async getSupportAnalytics(period: string) {
    const dateRange = this.getDateRange(period);
    
    // Ticket statistics
    const ticketStats = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select([
        'COUNT(*) as totalTickets',
        'COUNT(CASE WHEN ticket.status = :open THEN 1 END) as openTickets',
        'COUNT(CASE WHEN ticket.status = :resolved THEN 1 END) as resolvedTickets',
        'COUNT(CASE WHEN ticket.priority = :urgent THEN 1 END) as urgentTickets',
      ])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .setParameters({
        open: 'open',
        resolved: 'resolved',
        urgent: 'urgent',
      })
      .getRawOne();

    // Response time analysis
    const responseTimeStats = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select([
        'AVG(EXTRACT(EPOCH FROM (ticket.firstResponseAt - ticket.createdAt))/3600) as avgFirstResponseHours',
        'AVG(EXTRACT(EPOCH FROM (ticket.resolvedAt - ticket.createdAt))/3600) as avgResolutionHours',
      ])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .andWhere('ticket.firstResponseAt IS NOT NULL')
      .getRawOne();

    // Category distribution
    const categoryStats = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select(['ticket.category as category', 'COUNT(*) as count'])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('ticket.category')
      .getRawMany();

    // Customer satisfaction
    const satisfactionStats = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select(['AVG(ticket.customerRating) as avgRating', 'COUNT(ticket.customerRating) as ratedTickets'])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .andWhere('ticket.customerRating IS NOT NULL')
      .getRawOne();

    return {
      success: true,
      data: {
        tickets: ticketStats,
        responseTime: responseTimeStats,
        categories: categoryStats,
        satisfaction: satisfactionStats,
        period,
      },
    };
  }

  async getSupportPerformance(period: string, staffId?: string) {
    const dateRange = this.getDateRange(period);
    
    const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoin('ticket.assignedTo', 'staff')
      .leftJoin('staff.user', 'user')
      .select([
        'staff.id as staffId',
        'user.firstName as firstName',
        'user.lastName as lastName',
        'COUNT(*) as assignedTickets',
        'COUNT(CASE WHEN ticket.status = :resolved THEN 1 END) as resolvedTickets',
        'AVG(CASE WHEN ticket.firstResponseAt IS NOT NULL THEN EXTRACT(EPOCH FROM (ticket.firstResponseAt - ticket.createdAt))/3600 END) as avgResponseTime',
        'AVG(ticket.customerRating) as avgRating',
      ])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .setParameter('resolved', 'resolved');

    if (staffId) {
      queryBuilder.andWhere('staff.id = :staffId', { staffId });
    }

    const performance = await queryBuilder
      .groupBy('staff.id, user.firstName, user.lastName')
      .getRawMany();

    return {
      success: true,
      data: performance,
    };
  }

  async getSupportCategories() {
    const categories = [
      { id: 'order', name: 'Order Issues', description: 'Problems with orders, shipping, delivery' },
      { id: 'payment', name: 'Payment Issues', description: 'Payment failures, refunds, billing' },
      { id: 'product', name: 'Product Issues', description: 'Product defects, quality issues' },
      { id: 'account', name: 'Account Issues', description: 'Login problems, account settings' },
      { id: 'technical', name: 'Technical Issues', description: 'Website bugs, performance issues' },
      { id: 'other', name: 'Other', description: 'General inquiries and other issues' },
    ];

    return {
      success: true,
      data: categories,
    };
  }

  async getResponseTemplates() {
    // Mock response templates - TODO: Create actual ResponseTemplate entity
    const templates = [
      {
        id: '1',
        name: 'Order Status Inquiry',
        category: 'order',
        content: 'Thank you for contacting us regarding your order. Let me check the status for you...',
        isActive: true,
      },
      {
        id: '2',
        name: 'Refund Request Acknowledgment',
        category: 'payment',
        content: 'We have received your refund request and will process it within 3-5 business days...',
        isActive: true,
      },
      {
        id: '3',
        name: 'Product Quality Issue',
        category: 'product',
        content: 'We sincerely apologize for the quality issue with your product. We will arrange a replacement...',
        isActive: true,
      },
    ];

    return {
      success: true,
      data: templates,
    };
  }

  async createResponseTemplate(templateData: any) {
    // TODO: Implement actual template creation
    return {
      success: true,
      data: { ...templateData, id: Date.now().toString() },
      message: 'Response template created successfully',
    };
  }

  // Help Center Integration (REQ-076)
  async getKnowledgeBaseArticles(category?: string, search?: string) {
    // Mock knowledge base articles - TODO: Create actual KnowledgeBaseArticle entity
    const articles = [
      {
        id: '1',
        title: 'How to track your order',
        content: 'You can track your order by visiting the order tracking page...',
        category: 'orders',
        tags: ['tracking', 'orders', 'shipping'],
        views: 1250,
        helpful: 98,
        isPublished: true,
      },
      {
        id: '2',
        title: 'How to return a product',
        content: 'To return a product, please follow these steps...',
        category: 'returns',
        tags: ['returns', 'refunds', 'policy'],
        views: 892,
        helpful: 76,
        isPublished: true,
      },
    ];

    let filteredArticles = articles;

    if (category) {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }

    if (search) {
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content.toLowerCase().includes(search.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return {
      success: true,
      data: filteredArticles,
    };
  }

  async createKnowledgeBaseArticle(articleData: any, authorId: string) {
    // TODO: Implement actual article creation
    return {
      success: true,
      data: { ...articleData, id: Date.now().toString(), authorId },
      message: 'Knowledge base article created successfully',
    };
  }

  async getFAQ(category?: string) {
    // Mock FAQ data - TODO: Create actual FAQ entity
    const faqs = [
      {
        id: '1',
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.',
        category: 'shipping',
        order: 1,
      },
      {
        id: '2',
        question: 'What is your return policy?',
        answer: 'You can return items within 30 days of purchase for a full refund.',
        category: 'returns',
        order: 2,
      },
    ];

    let filteredFAQs = faqs;

    if (category) {
      filteredFAQs = filteredFAQs.filter(faq => faq.category === category);
    }

    return {
      success: true,
      data: filteredFAQs,
    };
  }

  async initiateLiveChat(customerId: string, chatData: any) {
    // TODO: Implement actual live chat functionality
    return {
      success: true,
      data: {
        chatId: `chat-${Date.now()}`,
        customerId,
        subject: chatData.subject,
        status: 'waiting',
        estimatedWaitTime: '2-3 minutes',
      },
      message: 'Live chat initiated successfully',
    };
  }

  async getSupportDashboardStats() {
    const [totalTickets, openTickets, todayTickets, avgRating] = await Promise.all([
      this.ticketRepository.count(),
      this.ticketRepository.count({ where: { status: In(['open', 'in_progress']) } }),
      this.ticketRepository.count({
        where: {
          createdAt: Between(
            new Date(new Date().setHours(0, 0, 0, 0)),
            new Date(new Date().setHours(23, 59, 59, 999))
          ),
        },
      }),
      this.ticketRepository
        .createQueryBuilder('ticket')
        .select('AVG(ticket.customerRating)', 'avg')
        .where('ticket.customerRating IS NOT NULL')
        .getRawOne(),
    ]);

    return {
      success: true,
      data: {
        totalTickets,
        openTickets,
        todayTickets,
        averageRating: parseFloat(avgRating?.avg || 0).toFixed(1),
        slaCompliance: 85.2, // Mock SLA compliance percentage
      },
    };
  }

  async getSLAReport(period: string) {
    const dateRange = this.getDateRange(period);
    
    // SLA targets (in hours)
    const slaTargets = {
      firstResponse: 2, // 2 hours
      resolution: 24, // 24 hours
    };

    const slaStats = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select([
        'COUNT(*) as totalTickets',
        'COUNT(CASE WHEN EXTRACT(EPOCH FROM (ticket.firstResponseAt - ticket.createdAt))/3600 <= :firstResponseSLA THEN 1 END) as firstResponseSLAMet',
        'COUNT(CASE WHEN EXTRACT(EPOCH FROM (ticket.resolvedAt - ticket.createdAt))/3600 <= :resolutionSLA THEN 1 END) as resolutionSLAMet',
      ])
      .where('ticket.createdAt BETWEEN :start AND :end', dateRange)
      .setParameters({
        firstResponseSLA: slaTargets.firstResponse,
        resolutionSLA: slaTargets.resolution,
      })
      .getRawOne();

    const firstResponseCompliance = slaStats.totalTickets > 0 
      ? (slaStats.firstResponseSLAMet / slaStats.totalTickets * 100).toFixed(1)
      : 0;

    const resolutionCompliance = slaStats.totalTickets > 0
      ? (slaStats.resolutionSLAMet / slaStats.totalTickets * 100).toFixed(1)
      : 0;

    return {
      success: true,
      data: {
        period,
        slaTargets,
        compliance: {
          firstResponse: parseFloat(firstResponseCompliance),
          resolution: parseFloat(resolutionCompliance),
          overall: ((parseFloat(firstResponseCompliance) + parseFloat(resolutionCompliance)) / 2).toFixed(1),
        },
        stats: slaStats,
      },
    };
  }

  private async autoAssignTicket(ticketId: string) {
    // Simple auto-assignment logic - assign to staff with least active tickets
    const staffWithWorkload = await this.staffRepository
      .createQueryBuilder('staff')
      .leftJoin('staff.user', 'user')
      .leftJoinAndSelect('support_tickets', 'tickets', 'tickets.assignedToId = staff.id AND tickets.status IN (:...activeStatuses)', {
        activeStatuses: ['open', 'in_progress'],
      })
      .select(['staff.id', 'user.firstName', 'user.lastName', 'COUNT(tickets.id) as ticketCount'])
      .where('staff.status = :status', { status: 'active' })
      .groupBy('staff.id, user.firstName, user.lastName')
      .orderBy('COUNT(tickets.id)', 'ASC')
      .limit(1)
      .getRawOne();

    if (staffWithWorkload) {
      await this.assignTicket(ticketId, staffWithWorkload.staff_id, 'system', 'Auto-assigned based on workload');
    }
  }

  private getDateRange(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start: startDate, end: now };
  }
}