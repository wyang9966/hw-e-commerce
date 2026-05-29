import seedProducts from "../../db/seed/products.json";
import { BadRequestError } from "../../core/errors";
import type { CreateProductInput, Product } from "./types";

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

type SeedProduct = Omit<Product, "id"> & { id: number };

const toProduct = (raw: SeedProduct): Product => ({
  ...raw,
  id: String(raw.id),
});

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

let products: Product[] = (seedProducts as SeedProduct[]).map(toProduct);

const validateCreateInput = (input: CreateProductInput): void => {
  if (!input.title?.trim()) throw new BadRequestError("title is required");
  if (!input.description?.trim()) throw new BadRequestError("description is required");
  if (!input.category?.trim()) throw new BadRequestError("category is required");
  if (!input.thumbnail?.trim()) throw new BadRequestError("thumbnail is required");
  if (typeof input.price !== "number" || input.price < 0) {
    throw new BadRequestError("price must be a non-negative number");
  }
  if (typeof input.stock !== "number" || !Number.isInteger(input.stock) || input.stock < 0) {
    throw new BadRequestError("stock must be a non-negative integer");
  }
};

export const productService = {
  getProducts(): Product[] {
    return products;
  },

  setProducts(next: Product[]): void {
    products = next;
  },

  normalizeListQuery(query: {
    skip?: unknown;
    limit?: unknown;
  }): { skip: number; limit: number } {
    const skip = query.skip === undefined ? DEFAULT_SKIP : Number(query.skip);
    const limit = query.limit === undefined ? DEFAULT_LIMIT : Number(query.limit);

    if (!Number.isInteger(skip) || skip < 0) {
      throw new BadRequestError("skip must be a non-negative integer");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      throw new BadRequestError(`limit must be an integer between 1 and ${MAX_LIMIT}`);
    }

    return { skip, limit };
  },

  matchesSearch(product: Product, query: string): boolean {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return (
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      (product.brand?.toLowerCase().includes(term) ?? false)
    );
  },

  create(input: CreateProductInput): Product {
    validateCreateInput(input);
    const newProduct: Product = {
      id: makeId(),
      title: input.title.trim(),
      description: input.description.trim(),
      price: input.price,
      discountPercentage: input.discountPercentage ?? 0,
      rating: input.rating ?? 0,
      stock: input.stock,
      brand: input.brand,
      category: input.category.trim().toLowerCase(),
      thumbnail: input.thumbnail.trim(),
    };
    products = [...products, newProduct];
    return newProduct;
  },

  reset(): void {
    products = (seedProducts as SeedProduct[]).map(toProduct);
  },
};
