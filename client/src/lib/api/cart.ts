import type { CartState, CartItem } from "../../types/cart";

const CART_STORAGE_KEY = "ecommerce-cart";

const getInitialCart = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? (JSON.parse(storedCart) as CartState) : { items: [] };
};

const saveCart = (cart: CartState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
};

export const cartAPI = {
  getCart: async (): Promise<CartState> => {
    return getInitialCart();
  },

  addItem: async (
    productId: number,
    quantity: number = 1,
  ): Promise<CartState> => {
    const cart = getInitialCart();
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    saveCart(cart);
    return cart;
  },

  removeItem: async (productId: number): Promise<CartState> => {
    const cart = getInitialCart();
    cart.items = cart.items.filter((item) => item.productId !== productId);
    saveCart(cart);
    return cart;
  },

  updateQuantity: async (
    productId: number,
    quantity: number,
  ): Promise<CartState> => {
    const cart = getInitialCart();
    const item = cart.items.find((item) => item.productId === productId);

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.productId !== productId);
      } else {
        item.quantity = quantity;
      }
    }

    saveCart(cart);
    return cart;
  },

  clearCart: async (): Promise<CartState> => {
    const cart: CartState = { items: [] };
    saveCart(cart);
    return cart;
  },
};
