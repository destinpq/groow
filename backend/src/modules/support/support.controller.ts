import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Support Center')
@ApiBearerAuth()
@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Support Center - Ticket Management (REQ-075)
  @Get('tickets')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get all support tickets' })
  async getAllTickets(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('search') search?: string,
  ) {
    return this.supportService.getAllTickets({
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
      category,
      assignedTo,
      search,
    });
  }

  @Get('tickets/my')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get customer tickets' })
  async getMyTickets(
    @CurrentUser('id') customerId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.supportService.getCustomerTickets(customerId, {
      page: Number(page),
      limit: Number(limit),
      status,
    });
  }

  @Get('tickets/assigned')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Get tickets assigned to staff' })
  async getAssignedTickets(
    @CurrentUser('id') staffUserId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
  ) {
    return this.supportService.getStaffTickets(staffUserId, {
      page: Number(page),
      limit: Number(limit),
      status,
    });
  }

  @Post('tickets')
  @Roles(UserRole.CUSTOMER)
  @UseInterceptors(FilesInterceptor('attachments', 5))
  @ApiOperation({ summary: 'Create support ticket' })
  async createTicket(
    @CurrentUser('id') customerId: string,
    @Body() ticketData: {
      subject: string;
      description: string;
      category: string;
      priority: string;
      orderId?: string;
    },
    @UploadedFiles() attachments?: Express.Multer.File[],
  ) {
    return this.supportService.createTicket(customerId, ticketData, attachments);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket details' })
  async getTicketById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.supportService.getTicketById(id, userId, userRole);
  }

  @Put('tickets/:id/assign')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Assign ticket to staff' })
  async assignTicket(
    @Param('id') ticketId: string,
    @Body() assignmentData: {
      assignedToId: string;
      notes?: string;
    },
    @CurrentUser('id') assignedBy: string,
  ) {
    return this.supportService.assignTicket(ticketId, assignmentData.assignedToId, assignedBy, assignmentData.notes);
  }

  @Put('tickets/:id/status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update ticket status' })
  async updateTicketStatus(
    @Param('id') ticketId: string,
    @Body() statusData: {
      status: string;
      resolution?: string;
      internalNotes?: string;
    },
    @CurrentUser('id') updatedBy: string,
  ) {
    return this.supportService.updateTicketStatus(ticketId, statusData, updatedBy);
  }

  @Put('tickets/:id/escalate')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Escalate ticket' })
  async escalateTicket(
    @Param('id') ticketId: string,
    @Body() escalationData: {
      reason: string;
      escalateToId?: string;
    },
    @CurrentUser('id') escalatedBy: string,
  ) {
    return this.supportService.escalateTicket(ticketId, escalationData.reason, escalatedBy, escalationData.escalateToId);
  }

  @Post('tickets/:id/messages')
  @UseInterceptors(FilesInterceptor('attachments', 3))
  @ApiOperation({ summary: 'Send message in ticket' })
  async sendTicketMessage(
    @Param('id') ticketId: string,
    @Body() messageData: {
      message: string;
      isInternal?: boolean;
    },
    @CurrentUser('id') senderId: string,
    @CurrentUser('role') senderRole: string,
    @UploadedFiles() attachments?: Express.Multer.File[],
  ) {
    return this.supportService.sendTicketMessage(ticketId, senderId, senderRole, messageData, attachments);
  }

  @Get('tickets/:id/messages')
  @ApiOperation({ summary: 'Get ticket messages' })
  async getTicketMessages(
    @Param('id') ticketId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.supportService.getTicketMessages(ticketId, userRole);
  }

  @Post('tickets/:id/feedback')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Submit ticket feedback' })
  async submitTicketFeedback(
    @Param('id') ticketId: string,
    @Body() feedbackData: {
      rating: number;
      feedback: string;
    },
    @CurrentUser('id') customerId: string,
  ) {
    return this.supportService.submitFeedback(ticketId, customerId, feedbackData.rating, feedbackData.feedback);
  }

  @Get('analytics/overview')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get support analytics overview' })
  async getSupportAnalytics(
    @Query('period') period: string = '30d',
  ) {
    return this.supportService.getSupportAnalytics(period);
  }

  @Get('analytics/performance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get support team performance' })
  async getSupportPerformance(
    @Query('period') period: string = '30d',
    @Query('staffId') staffId?: string,
  ) {
    return this.supportService.getSupportPerformance(period, staffId);
  }

  @Get('categories/list')
  @ApiOperation({ summary: 'Get support categories' })
  async getSupportCategories() {
    return this.supportService.getSupportCategories();
  }

  @Get('templates/list')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Get response templates' })
  async getResponseTemplates() {
    return this.supportService.getResponseTemplates();
  }

  @Post('templates')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create response template' })
  async createResponseTemplate(
    @Body() templateData: {
      name: string;
      category: string;
      content: string;
      isActive: boolean;
    },
  ) {
    return this.supportService.createResponseTemplate(templateData);
  }

  // Help Center Integration (REQ-076)
  @Get('knowledge-base/articles')
  @ApiOperation({ summary: 'Get help center articles' })
  async getKnowledgeBaseArticles(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.supportService.getKnowledgeBaseArticles(category, search);
  }

  @Post('knowledge-base/articles')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create knowledge base article' })
  async createKnowledgeBaseArticle(
    @Body() articleData: {
      title: string;
      content: string;
      category: string;
      tags: string[];
      isPublished: boolean;
    },
    @CurrentUser('id') authorId: string,
  ) {
    return this.supportService.createKnowledgeBaseArticle(articleData, authorId);
  }

  @Get('faq')
  @ApiOperation({ summary: 'Get frequently asked questions' })
  async getFAQ(@Query('category') category?: string) {
    return this.supportService.getFAQ(category);
  }

  @Post('chat/initiate')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Initiate live chat' })
  async initiateLiveChat(
    @CurrentUser('id') customerId: string,
    @Body() chatData: {
      subject: string;
      initialMessage: string;
    },
  ) {
    return this.supportService.initiateLiveChat(customerId, chatData);
  }

  @Get('dashboard/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get support dashboard statistics' })
  async getSupportDashboardStats() {
    return this.supportService.getSupportDashboardStats();
  }

  @Get('reports/sla')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get SLA compliance report' })
  async getSLAReport(
    @Query('period') period: string = '30d',
  ) {
    return this.supportService.getSLAReport(period);
  }
}