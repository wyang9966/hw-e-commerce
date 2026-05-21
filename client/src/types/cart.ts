export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
  };
}
