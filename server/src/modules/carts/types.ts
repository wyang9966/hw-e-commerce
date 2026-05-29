export interface CartLineProduct {
  id: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: string;
  userId: string;
  products: CartLineProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProductInput {
  id: string;
  quantity: number;
}

export interface CreateCartInput {
  userId: string;
  products?: CartProductInput[];
}

export interface UpdateCartInput {
  userId?: string;
  products?: CartProductInput[];
  merge?: boolean;
}

export interface AddCartItemInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
