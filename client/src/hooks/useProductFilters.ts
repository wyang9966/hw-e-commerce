import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type ProductSortOption =
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "discount_desc";

export type ProductFilters = {
  category?: string;
  minPrice: number;
  maxPrice: number;
  rating?: number;
  deals: boolean;
  sort?: ProductSortOption;
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 2000;

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ProductFilters>(() => {
    const category = searchParams.get("category") ?? undefined;
    const minPrice = parseNumber(searchParams.get("minPrice"), DEFAULT_MIN_PRICE);
    const maxPrice = parseNumber(searchParams.get("maxPrice"), DEFAULT_MAX_PRICE);
    const ratingParam = searchParams.get("rating");
    const rating = ratingParam ? Number(ratingParam) : undefined;
    const deals = searchParams.get("deals") === "true";
    const sort = searchParams.get("sort") as ProductSortOption | null;

    return {
      category,
      minPrice,
      maxPrice,
      rating: rating && Number.isFinite(rating) ? rating : undefined,
      deals,
      sort: sort ?? undefined,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (partial: Partial<ProductFilters>) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      const nextFilters = { ...filters, ...partial };

      const setParam = (
        key: string,
        value: string | undefined,
        defaultValue?: string,
      ) => {
        if (!value || value === defaultValue) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      };

      setParam("category", nextFilters.category ?? undefined);
      setParam(
        "minPrice",
        String(nextFilters.minPrice),
        String(DEFAULT_MIN_PRICE),
      );
      setParam(
        "maxPrice",
        String(nextFilters.maxPrice),
        String(DEFAULT_MAX_PRICE),
      );
      setParam("rating", nextFilters.rating ? String(nextFilters.rating) : undefined);
      setParam("deals", nextFilters.deals ? "true" : undefined);
      setParam("sort", nextFilters.sort ?? undefined);

      setSearchParams(nextParams, { replace: true });
    },
    [filters, searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    ["category", "minPrice", "maxPrice", "rating", "deals", "sort"].forEach(
      (key) => nextParams.delete(key),
    );
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return { filters, setFilters, clearFilters };
};
