import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { AddToCartDto, UpdateCartItemDto, AddToWishlistDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(customerId: string, addToCartDto: AddToCartDto): Promise<CartItem> {
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.stockQuantity < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: {
        customerId,
        productId: addToCartDto.productId,
        variantId: addToCartDto.variantId,
      },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += addToCartDto.quantity;
      return this.cartItemRepository.save(existingItem);
    }

    // Create new cart item
    const price = product.salePrice || product.basePrice;
    const cartItem = this.cartItemRepository.create({
      customerId,
      ...addToCartDto,
      price,
    });

    return this.cartItemRepository.save(cartItem);
  }

  async getCart(customerId: string) {
    const items = await this.cartItemRepository.find({
      where: { customerId },
      relations: ['product'],
    });

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      items,
      summary: {
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        tax: subtotal * 0.1, // 10% tax
        total: subtotal * 1.1,
      },
    };
  }

  async updateCartItem(
    customerId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, customerId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stockQuantity < updateCartItemDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(customerId: string, itemId: string): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, customerId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async clearCart(customerId: string): Promise<void> {
    await this.cartItemRepository.delete({ customerId });
  }

  // Wishlist methods
  async addToWishlist(customerId: string, addToWishlistDto: AddToWishlistDto): Promise<WishlistItem> {
    const product = await this.productRepository.findOne({
      where: { id: addToWishlistDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.wishlistItemRepository.findOne({
      where: { customerId, productId: addToWishlistDto.productId },
    });

    if (existing) {
      throw new BadRequestException('Product already in wishlist');
    }

    const wishlistItem = this.wishlistItemRepository.create({
      customerId,
      ...addToWishlistDto,
    });

    return this.wishlistItemRepository.save(wishlistItem);
  }

  async getWishlist(customerId: string): Promise<WishlistItem[]> {
    return this.wishlistItemRepository.find({
      where: { customerId },
      relations: ['product'],
    });
  }

  async removeFromWishlist(customerId: string, itemId: string): Promise<void> {
    const wishlistItem = await this.wishlistItemRepository.findOne({
      where: { id: itemId, customerId },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistItemRepository.remove(wishlistItem);
  }

  async moveToCart(customerId: string, itemId: string): Promise<CartItem> {
    const wishlistItem = await this.wishlistItemRepository.findOne({
      where: { id: itemId, customerId },
      relations: ['product'],
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    const cartItem = await this.addToCart(customerId, {
      productId: wishlistItem.productId,
      quantity: 1,
    });

    await this.wishlistItemRepository.remove(wishlistItem);

    return cartItem;
  }
}
