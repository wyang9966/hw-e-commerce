import { BadRequestError, NotFoundError } from "../../core/errors";
import { productService } from "../products/product.service";
import type { Product } from "../products/types";
import type {
  Cart,
  CartLineProduct,
  CartProductInput,
  CreateCartInput,
} from "./types";

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const buildLineProduct = (product: Product, quantity: number): CartLineProduct => {
  const total = roundMoney(product.price * quantity);
  const discountedTotal = roundMoney(total * (1 - product.discountPercentage / 100));

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity,
    total,
    discountPercentage: product.discountPercentage,
    discountedTotal,
    thumbnail: product.thumbnail,
  };
};

const recalculateCart = (cart: Omit<Cart, "total" | "discountedTotal" | "totalProducts" | "totalQuantity">): Cart => {
  const total = roundMoney(cart.products.reduce((sum, item) => sum + item.total, 0));
  const discountedTotal = roundMoney(cart.products.reduce((sum, item) => sum + item.discountedTotal, 0));
  const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    total,
    discountedTotal,
    totalProducts: cart.products.length,
    totalQuantity,
  };
};

const resolveProducts = (items: CartProductInput[] = []): CartLineProduct[] => {
  return items.map((item) => {
    const product = productService.getProducts().filter((p) => p.id === String(item.id))[0];
    if (!product) throw new NotFoundError(`Product not found: ${item.id}`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new BadRequestError("quantity must be a positive integer");
    }
    return buildLineProduct(product, item.quantity);
  });
};

const seedCarts = (): Cart[] => {
  const emilyItems = resolveProducts([
    { id: "1", quantity: 2 },
    { id: "2", quantity: 1 },
  ]);
  const michaelItems = resolveProducts([{ id: "5", quantity: 1 }]);

  return [
    recalculateCart({ id: "1", userId: "1", products: emilyItems }),
    recalculateCart({ id: "2", userId: "2", products: michaelItems }),
  ];
};

let carts: Cart[] = seedCarts();

export const cartService = {
  getCarts(): Cart[] {
    return carts;
  },

  setCarts(next: Cart[]): void {
    carts = next;
  },

  buildLineProduct,

  withProducts(cart: Cart, products: CartLineProduct[]): Cart {
    return recalculateCart({ ...cart, products });
  },

  userHasCart(userId: string, excludeCartId?: string): boolean {
    return carts.some((c) => c.userId === userId && c.id !== excludeCartId);
  },

  normalizeQuantity(quantity: unknown): number {
    const qty = quantity === undefined ? 1 : Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new BadRequestError("quantity must be a positive integer");
    }
    return qty;
  },

  create(input: CreateCartInput): Cart {
    const userId = String(input.userId).trim();
    if (!userId) throw new BadRequestError("userId is required");
    if (this.userHasCart(userId)) {
      throw new BadRequestError("User already has a cart");
    }

    const products = resolveProducts(input.products ?? []);
    const newCart = recalculateCart({
      id: makeId(),
      userId,
      products,
    });

    carts = [...carts, newCart];
    return newCart;
  },

  reset(): void {
    carts = seedCarts();
  },
};
