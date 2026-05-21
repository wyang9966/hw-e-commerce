import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "../lib/api/cart";
import type { CartState } from "../types/cart";

const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  return useQuery<CartState, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartAPI.getCart(),
  });
};

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity?: number }) =>
      cartAPI.addItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => cartAPI.removeItem(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartAPI.updateQuantity(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
};
