export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
}

export interface ProductsListQuery {
  skip?: number;
  limit?: number;
  category?: string;
  q?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type CreateProductInput = Omit<Product, "id">;

export type UpdateProductInput = Partial<CreateProductInput>;
