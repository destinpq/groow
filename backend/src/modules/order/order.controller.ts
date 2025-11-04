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
}
