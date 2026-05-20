import { useQuery } from "@tanstack/react-query";
import { productsAPI } from "../lib/api/products";
import type { Product, ProductsResponse, Category } from "../types/product";

export const useProducts = (params?: { skip?: number; limit?: number; category?: string }) => {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => productsAPI.getAllProducts(params),
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => productsAPI.getProductById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => productsAPI.getCategories(),
  });
};

// export const useSearchProducts = (query: string) => {
//   return useQuery<ProductsResponse, Error>({
//     queryKey: ["products", "search", query],
//     queryFn: () => productsAPI.searchProducts(query),
//     enabled: !!query,
//   });
// };
