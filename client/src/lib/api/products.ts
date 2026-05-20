import { axiosClient } from "../axiosClient";
import type { Product, ProductsResponse, Category } from "../../types/product";

export const productsAPI = {
  getAllProducts: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
  }): Promise<ProductsResponse> => {
    const { data } = await axiosClient.get<ProductsResponse>("/products", {
      params,
    });
    return data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const { data } = await axiosClient.get<Product>(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await axiosClient.get<Category[]>("/categories");
    return data;
  },

//   searchProducts: async (query: string): Promise<ProductsResponse> => {
//     const { data } = await axiosClient.get<ProductsResponse>("/products/search", {
//       params: { q: query },
//     });
//     return data;
//   },
};
