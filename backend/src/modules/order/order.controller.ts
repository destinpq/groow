import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderFilterDto } from './dto/order.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole, OrderStatus } from '@/common/enums';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create order from cart' })
  create(
    @CurrentUser('id') customerId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(customerId, createOrderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get all orders (Admin/Vendor)' })
  findAll(@Query() filters: OrderFilterDto) {
    return this.orderService.findAll(filters);
  }

  @Get('my-orders')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get customer orders' })
  getMyOrders(
    @CurrentUser('id') customerId: string,
    @Query() filters: OrderFilterDto,
  ) {
    return this.orderService.getCustomerOrders(customerId, filters);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order statistics' })
  getStats() {
    return this.orderService.getOrderStats();
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get orders by status' })
  getByStatus(@Param('status') status: OrderStatus) {
    return this.orderService.getOrdersByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Cancel order' })
  cancelOrder(
    @Param('id') id: string,
    @CurrentUser('id') customerId: string,
  ) {
    return this.orderService.cancelOrder(id, customerId);
  }

  // Enhanced order management endpoints for all states (REQ-055 to REQ-063)

  @Get('manifested')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get manifested orders' })
  getManifestOrders() {
    return this.orderService.getManifestOrders();
  }

  @Get('disputed')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get disputed orders' })
  getDisputedOrders() {
    return this.orderService.getDisputedOrders();
  }

  @Get('cancelled')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get cancelled orders' })
  getCancelledOrders() {
    return this.orderService.getCancelledOrders();
  }

  @Get('hold')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get orders on hold' })
  getHoldOrders() {
    return this.orderService.getHoldOrders();
  }

  @Get('returns')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get return/refund orders' })
  getReturnRefundOrders() {
    return this.orderService.getReturnRefundOrders();
  }

  @Patch(':id/manifest')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Manifest order for shipping' })
  manifestOrder(@Param('id') id: string) {
    return this.orderService.manifestOrder(id);
  }

  @Patch(':id/ship')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Ship order with tracking' })
  shipOrder(
    @Param('id') id: string,
    @Body() shipData: { trackingNumber: string; carrierId: string },
  ) {
    return this.orderService.shipOrder(id, shipData.trackingNumber, shipData.carrierId);
  }

  @Patch(':id/hold')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Put order on hold' })
  holdOrder(
    @Param('id') id: string,
    @Body() holdData: { reason: string },
  ) {
    return this.orderService.holdOrder(id, holdData.reason);
  }

  @Patch(':id/dispute')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create order dispute' })
  disputeOrder(
    @Param('id') id: string,
    @Body() disputeData: { reason: string; description: string },
  ) {
    return this.orderService.disputeOrder(id, disputeData.reason, disputeData.description);
  }

  @Patch(':id/return')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Request order return' })
  processReturn(
    @Param('id') id: string,
    @Body() returnData: { reason: string },
  ) {
    return this.orderService.processReturn(id, returnData.reason);
  }

  @Patch(':id/refund')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process order refund' })
  processRefund(
    @Param('id') id: string,
    @Body() refundData: { amount: number; reason: string },
  ) {
    return this.orderService.processRefund(id, refundData.amount, refundData.reason);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get delivery tracking information' })
  getDeliveryTracking(@Param('id') id: string) {
    return this.orderService.getDeliveryTracking(id);
  }

  @Get('analytics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get order analytics' })
  getOrderAnalytics(@Query('period') period?: string) {
    return this.orderService.getOrderAnalytics(period);
  }
}
