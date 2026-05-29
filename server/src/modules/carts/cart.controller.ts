import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../core/errors";
import { productService } from "../products/product.service";
import { cartService } from "./cart.service";
import type { AddCartItemInput, Cart, CreateCartInput, UpdateCartInput } from "./types";

export const getAllCarts = (_req: Request, res: Response) => {
  res.json({ success: true, data: cartService.getCarts() });
};

export const getCartById = (req: Request, res: Response) => {
  const cart = cartService.getCarts().filter((c) => c.id === req.params.id)[0];
  if (!cart) throw new NotFoundError("Cart not found");
  res.json({ success: true, data: cart });
};

export const getCartByUserId = (req: Request, res: Response) => {
  const cart = cartService.getCarts().filter((c) => c.userId === req.params.userId)[0];
  if (!cart) throw new NotFoundError("Cart not found for user");
  res.json({ success: true, data: cart });
};

export const createCart = (req: Request, res: Response) => {
  const cart = cartService.create(req.body as CreateCartInput);
  res.status(201).json({ success: true, data: cart });
};

export const updateCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as UpdateCartInput;

  const current = cartService.getCarts().filter((c) => c.id === id)[0];
  if (!current) throw new NotFoundError("Cart not found");

  if (body.userId !== undefined) {
    const nextUserId = String(body.userId).trim();
    if (!nextUserId) throw new BadRequestError("userId cannot be empty");
    if (cartService.userHasCart(nextUserId, id)) {
      throw new BadRequestError("User already has a cart");
    }
  }

  let updated: Cart | undefined;
  const nextCarts = cartService.getCarts().map((cart) => {
    if (cart.id !== id) return cart;

    const userId = body.userId !== undefined ? String(body.userId).trim() : cart.userId;
    let products = cart.products;

    if (body.products) {
      const incoming = body.products.map((item) => {
        const product = productService.getProducts().filter((p) => p.id === String(item.id))[0];
        if (!product) throw new NotFoundError(`Product not found: ${item.id}`);
        const quantity = cartService.normalizeQuantity(item.quantity);
        return cartService.buildLineProduct(product, quantity);
      });

      if (body.merge) {
        const merged = [...cart.products];
        incoming.forEach((line) => {
          const index = merged.findIndex((p) => p.id === line.id);
          if (index === -1) {
            merged.push(line);
            return;
          }
          const existing = merged[index];
          const product = productService.getProducts().filter((p) => p.id === line.id)[0]!;
          merged[index] = cartService.buildLineProduct(
            product,
            existing.quantity + line.quantity,
          );
        });
        products = merged;
      } else {
        products = incoming;
      }
    }

    updated = cartService.withProducts({ ...cart, userId }, products);
    return updated;
  });

  if (!updated) throw new NotFoundError("Cart not found");
  cartService.setCarts(nextCarts);
  res.json({ success: true, data: updated });
};

export const deleteCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const current = cartService.getCarts();
  const nextCarts = current.filter((c) => c.id !== id);
  if (nextCarts.length === current.length) throw new NotFoundError("Cart not found");
  cartService.setCarts(nextCarts);
  res.status(204).send();
};

export const addCartItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity } = req.body as AddCartItemInput;

  const cart = cartService.getCarts().filter((c) => c.id === id)[0];
  if (!cart) throw new NotFoundError("Cart not found");

  const product = productService.getProducts().filter((p) => p.id === String(productId))[0];
  if (!product) throw new NotFoundError("Product not found");

  const qty = cartService.normalizeQuantity(quantity);

  const existing = cart.products.filter((p) => p.id === product.id)[0];
  const nextProducts = existing
    ? cart.products.map((p) =>
        p.id === product.id
          ? cartService.buildLineProduct(product, p.quantity + qty)
          : p,
      )
    : [...cart.products, cartService.buildLineProduct(product, qty)];

  let updated: Cart | undefined;
  const nextCarts = cartService.getCarts().map((c) => {
    if (c.id !== id) return c;
    updated = cartService.withProducts(c, nextProducts);
    return updated;
  });

  cartService.setCarts(nextCarts);
  res.json({ success: true, data: updated });
};

export const updateCartItem = (req: Request, res: Response) => {
  const { id, productId } = req.params;
  const qty = cartService.normalizeQuantity(req.body.quantity);

  const cart = cartService.getCarts().filter((c) => c.id === id)[0];
  if (!cart) throw new NotFoundError("Cart not found");

  const product = productService.getProducts().filter((p) => p.id === productId)[0];
  if (!product) throw new NotFoundError("Product not found");

  if (!cart.products.some((p) => p.id === productId)) {
    throw new NotFoundError("Item not found in cart");
  }

  let updated: Cart | undefined;
  const nextProducts = cart.products.map((p) =>
    p.id === productId ? cartService.buildLineProduct(product, qty) : p,
  );

  const nextCarts = cartService.getCarts().map((c) => {
    if (c.id !== id) return c;
    updated = cartService.withProducts(c, nextProducts);
    return updated;
  });

  cartService.setCarts(nextCarts);
  res.json({ success: true, data: updated });
};

export const removeCartItem = (req: Request, res: Response) => {
  const { id, productId } = req.params;

  const cart = cartService.getCarts().filter((c) => c.id === id)[0];
  if (!cart) throw new NotFoundError("Cart not found");

  const nextProducts = cart.products.filter((p) => p.id !== productId);
  if (nextProducts.length === cart.products.length) {
    throw new NotFoundError("Item not found in cart");
  }

  let updated: Cart | undefined;
  const nextCarts = cartService.getCarts().map((c) => {
    if (c.id !== id) return c;
    updated = cartService.withProducts(c, nextProducts);
    return updated;
  });

  cartService.setCarts(nextCarts);
  res.json({ success: true, data: updated });
};
