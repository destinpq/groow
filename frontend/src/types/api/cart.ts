import { 
  ApiResponse, 
  BaseEntity, 
  BaseFilter,
  PaginatedResponse 
} from './common';

// ================================
// CART ENTITY TYPES
// ================================

export interface CartItem extends BaseEntity {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedAttributes?: {
    name: string;
    value: string;
  }[];
  product?: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    stock: number;
    price: number;
    discountedPrice?: number;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
  };
}

export interface Cart extends BaseEntity {
  id: string;
  customerId: string;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  finalAmount: number;
  expiresAt?: Date;
}

export interface WishlistItem extends BaseEntity {
  id: string;
  customerId: string;
  productId: string;
  notes?: string;
  addedAt: Date;
  product?: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    discountedPrice?: number;
    inStock: boolean;
  };
}

export interface Wishlist {
  id: string;
  customerId: string;
  items: WishlistItem[];
  totalItems: number;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedAttributes?: {
    name: string;
    value: string;
  }[];
}

export interface AddToCartResponse {
  cartItem: CartItem;
  cart: Cart;
  message: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface UpdateCartItemResponse {
  cartItem: CartItem;
  cart: Cart;
  message: string;
}

export interface RemoveFromCartResponse {
  removedItem: CartItem;
  cart: Cart;
  message: string;
}

export interface GetCartResponse {
  cart: Cart;
}

export interface ClearCartResponse {
  message: string;
  itemsCleared: number;
}

export interface AddToWishlistRequest {
  productId: string;
  notes?: string;
}

export interface AddToWishlistResponse {
  wishlistItem: WishlistItem;
  message: string;
}

export interface RemoveFromWishlistResponse {
  removedItem: WishlistItem;
  message: string;
}

export interface GetWishlistResponse {
  wishlist: Wishlist;
}

export interface MoveToCartRequest {
  quantity?: number;
  variantId?: string;
}

export interface MoveToCartResponse {
  cartItem: CartItem;
  removedWishlistItem: WishlistItem;
  message: string;
}

// ================================
// FILTER TYPES
// ================================

export interface CartFilter extends BaseFilter {
  customerId?: string;
  sessionId?: string;
  hasItems?: boolean;
  minAmount?: number;
  maxAmount?: number;
  expiresAfter?: Date;
  expiresBefore?: Date;
}

export interface WishlistFilter extends BaseFilter {
  customerId?: string;
  productCategory?: string;
  addedAfter?: Date;
  addedBefore?: Date;
  inStock?: boolean;
}

// ================================
// CART API INTERFACE
// ================================

export interface CartAPI {
  // Cart Management
  getCart(): Promise<ApiResponse<GetCartResponse>>;
  addToCart(request: AddToCartRequest): Promise<ApiResponse<AddToCartResponse>>;
  updateCartItem(itemId: string, request: UpdateCartItemRequest): Promise<ApiResponse<UpdateCartItemResponse>>;
  removeFromCart(itemId: string): Promise<ApiResponse<RemoveFromCartResponse>>;
  clearCart(): Promise<ApiResponse<ClearCartResponse>>;
  
  // Cart Validation
  validateCart(): Promise<ApiResponse<{
    cart: Cart;
    issues: {
      itemId: string;
      issue: 'out_of_stock' | 'price_changed' | 'unavailable';
      message: string;
    }[];
  }>>;
  
  // Wishlist Management
  getWishlist(): Promise<ApiResponse<GetWishlistResponse>>;
  addToWishlist(request: AddToWishlistRequest): Promise<ApiResponse<AddToWishlistResponse>>;
  removeFromWishlist(itemId: string): Promise<ApiResponse<RemoveFromWishlistResponse>>;
  moveToCart(wishlistItemId: string, request: MoveToCartRequest): Promise<ApiResponse<MoveToCartResponse>>;
  
  // Admin Cart Operations
  getAllCarts(filter?: CartFilter): Promise<ApiResponse<PaginatedResponse<Cart>>>;
  getCustomerCart(customerId: string): Promise<ApiResponse<GetCartResponse>>;
  clearExpiredCarts(): Promise<ApiResponse<{
    message: string;
    clearedCount: number;
  }>>;
}