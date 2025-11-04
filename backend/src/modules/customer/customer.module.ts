import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, WishlistItem, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CustomerModule {}
