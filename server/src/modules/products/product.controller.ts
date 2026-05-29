import { Request, Response } from "express";
import { productService } from "./product.service";
import type { CreateProductInput, Product } from "./types";
import { NotFoundError } from "../../core/errors";

export const getAllProducts = (req: Request, res: Response) => {
  const { skip, limit } = productService.normalizeListQuery({
    skip: req.query.skip !== undefined ? Number(req.query.skip) : undefined,
    limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
  });

  const category = typeof req.query.category === "string" ? req.query.category.trim() : undefined;
  const search =
    typeof req.query.q === "string"
      ? req.query.q
      : typeof req.query.search === "string"
        ? req.query.search
        : undefined;

  let filtered = productService.getProducts();

  if (category) {
    const normalizedCategory = category.toLowerCase();
    filtered = filtered.filter((p) => p.category.toLowerCase() === normalizedCategory);
  }

  if (search) {
    filtered = filtered.filter((p) => productService.matchesSearch(p, search));
  }

  const page = filtered.slice(skip, skip + limit);

  res.json({
    success: true,
    data: {
      products: page,
      total: filtered.length,
      skip,
      limit,
    },
  });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = productService.getProducts().filter((p) => p.id === id)[0];
  if (!product) throw new NotFoundError("Product not found");
  res.json({ success: true, data: product });
};

export const createProduct = (req: Request, res: Response) => {
  const newProduct = productService.create(req.body as CreateProductInput);
  res.status(201).json({ success: true, data: newProduct });
};

export const updateProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as Partial<CreateProductInput>;

  let updated: Product | undefined;
  const nextProducts = productService.getProducts().map((p) => {
    if (p.id !== id) return p;
    updated = {
      ...p,
      title: body.title ?? p.title,
      description: body.description ?? p.description,
      price: body.price ?? p.price,
      discountPercentage: body.discountPercentage ?? p.discountPercentage,
      rating: body.rating ?? p.rating,
      stock: body.stock ?? p.stock,
      brand: body.brand ?? p.brand,
      category: body.category ?? p.category,
      thumbnail: body.thumbnail ?? p.thumbnail,
    };
    return updated;
  });

  if (!updated) throw new NotFoundError("Product not found");
  productService.setProducts(nextProducts);
  res.json({ success: true, data: updated });
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  const current = productService.getProducts();
  const nextProducts = current.filter((p) => p.id !== id);
  if (nextProducts.length === current.length) throw new NotFoundError("Product not found");
  productService.setProducts(nextProducts);
  res.status(204).send();
};
