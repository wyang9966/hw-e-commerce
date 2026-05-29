import { Request, Response } from "express";
import { Product } from "./types";
import { NotFoundError } from "../../core/errors";

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

let products: Product[] = [];

export const getAllProducts = (_req: Request, res: Response) => {
  res.json({ success: true, data: products });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const p = products.filter((x) => x.id === id)[0];
  if (!p) throw new NotFoundError("Product not found");
  res.json({ success: true, data: p });
};

export const createProduct = (req: Request, res: Response) => {
  const body = req.body;
  const newProduct: Product = {
    id: makeId(),
    name: body.name,
    description: body.description,
    price: body.price,
    createdAt: new Date().toISOString(),
  };
  products = [...products, newProduct];
  res.status(201).json({ success: true, data: newProduct });
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  let updated: Product | undefined;
  products = products.map((p) => {
    if (p.id !== id) return p;
    updated = {
      ...p,
      name: body.name ?? p.name,
      description: body.description ?? p.description,
      price: body.price ?? p.price,
    };
    return updated;
  });

  if (!updated) throw new NotFoundError("Product not found");
  res.json({ success: true, data: updated });
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const before = products.length;
  products = products.filter((p) => p.id !== id);
  if (products.length === before) throw new NotFoundError("Product not found");
  res.status(204).send();
};
