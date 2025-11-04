import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, AddToWishlistDto } from './dto/cart.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { ApiResponse } from '@/common/dto/api-response.dto';

@ApiTags('Cart & Wishlist')
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const customerId = req.user.id;
    const cartItem = await this.cartService.addToCart(customerId, addToCartDto);
    return ApiResponse.success('Item added to cart', cartItem);
  }

  @Get()
  @ApiOperation({ summary: 'Get cart items' })
  async getCart(@Request() req) {
    const customerId = req.user.id;
    const cart = await this.cartService.getCart(customerId);
    return ApiResponse.success('Cart retrieved successfully', cart);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const customerId = req.user.id;
    const cartItem = await this.cartService.updateCartItem(customerId, itemId, updateCartItemDto);
    return ApiResponse.success('Cart item updated', cartItem);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    const customerId = req.user.id;
    await this.cartService.removeFromCart(customerId, itemId);
    return ApiResponse.success('Item removed from cart');
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  async clearCart(@Request() req) {
    const customerId = req.user.id;
    await this.cartService.clearCart(customerId);
    return ApiResponse.success('Cart cleared successfully');
  }

  // Wishlist endpoints
  @Post('wishlist')
  @ApiOperation({ summary: 'Add item to wishlist' })
  async addToWishlist(@Request() req, @Body() addToWishlistDto: AddToWishlistDto) {
    const customerId = req.user.id;
    const wishlistItem = await this.cartService.addToWishlist(customerId, addToWishlistDto);
    return ApiResponse.success('Item added to wishlist', wishlistItem);
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get wishlist items' })
  async getWishlist(@Request() req) {
    const customerId = req.user.id;
    const wishlist = await this.cartService.getWishlist(customerId);
    return ApiResponse.success('Wishlist retrieved successfully', wishlist);
  }

  @Delete('wishlist/:itemId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  async removeFromWishlist(@Request() req, @Param('itemId') itemId: string) {
    const customerId = req.user.id;
    await this.cartService.removeFromWishlist(customerId, itemId);
    return ApiResponse.success('Item removed from wishlist');
  }

  @Post('wishlist/:itemId/move-to-cart')
  @ApiOperation({ summary: 'Move wishlist item to cart' })
  async moveToCart(@Request() req, @Param('itemId') itemId: string) {
    const customerId = req.user.id;
    const cartItem = await this.cartService.moveToCart(customerId, itemId);
    return ApiResponse.success('Item moved to cart', cartItem);
  }
}
