import type {
  Watch,
  Brand,
  MovementType,
  CaseMaterial,
  Crystal,
  Strap,
} from "../mock/watches";
import { watches } from "../mock/watches";

// Simulate network latency
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulate random errors (10% chance for mutations)
function shouldError(isMutation: boolean = false): boolean {
  if (!isMutation) return false;
  return Math.random() < 0.1;
}

export interface FetchWatchesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: {
    brands?: Brand[];
    minPrice?: number;
    maxPrice?: number;
    caseSizeMin?: number;
    caseSizeMax?: number;
    movementType?: MovementType[];
    waterResistance?: number[];
    caseMaterial?: CaseMaterial[];
    crystal?: Crystal[];
    strap?: Strap[];
    complications?: string[];
    inStock?: boolean;
    minRating?: number;
  };
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
}

export interface FetchWatchesResponse {
  watches: Watch[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchWatches(
  params: FetchWatchesParams = {}
): Promise<FetchWatchesResponse> {
  const {
    page = 1,
    pageSize = 12,
    search = "",
    filters = {},
    sort = "featured",
  } = params;

  await delay(500 + Math.random() * 700); // 500-1200ms

  let filtered = [...watches];

  // Search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (watch) =>
        watch.brand.toLowerCase().includes(searchLower) ||
        watch.model.toLowerCase().includes(searchLower) ||
        watch.complications.some((c) => c.toLowerCase().includes(searchLower))
    );
  }

  // Filters
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.brands!.includes(watch.brand)
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((watch) => watch.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((watch) => watch.price <= filters.maxPrice!);
  }

  if (filters.caseSizeMin !== undefined) {
    filtered = filtered.filter(
      (watch) => watch.caseSizeMm >= filters.caseSizeMin!
    );
  }

  if (filters.caseSizeMax !== undefined) {
    filtered = filtered.filter(
      (watch) => watch.caseSizeMm <= filters.caseSizeMax!
    );
  }

  if (filters.movementType && filters.movementType.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.movementType!.includes(watch.movementType)
    );
  }

  if (filters.waterResistance && filters.waterResistance.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.waterResistance!.some((wr) => watch.waterResistanceM >= wr)
    );
  }

  if (filters.caseMaterial && filters.caseMaterial.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.caseMaterial!.includes(watch.caseMaterial)
    );
  }

  if (filters.crystal && filters.crystal.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.crystal!.includes(watch.crystal)
    );
  }

  if (filters.strap && filters.strap.length > 0) {
    filtered = filtered.filter((watch) => filters.strap!.includes(watch.strap));
  }

  if (filters.complications && filters.complications.length > 0) {
    filtered = filtered.filter((watch) =>
      filters.complications!.some((comp) => watch.complications.includes(comp))
    );
  }

  if (filters.inStock !== undefined) {
    filtered = filtered.filter((watch) => watch.inStock === filters.inStock);
  }

  if (filters.minRating !== undefined) {
    filtered = filtered.filter((watch) => watch.rating >= filters.minRating!);
  }

  // Sorting
  switch (sort) {
    case "featured":
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      break;
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return {
    watches: paginated,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function fetchWatchById(id: string): Promise<Watch | null> {
  await delay(500 + Math.random() * 700);
  return watches.find((watch) => watch.id === id) || null;
}

export interface CartMutationParams {
  id: string;
  qty: number;
}

export async function mutateCartAdd(
  _params: CartMutationParams
): Promise<void> {
  await delay(500 + Math.random() * 700);

  if (shouldError(true)) {
    throw new Error("Failed to add item to cart. Please try again.");
  }

  // In a real app, this would call the backend
  // For mock, we just simulate success
}

export async function mutateCartUpdate(
  _params: CartMutationParams
): Promise<void> {
  await delay(500 + Math.random() * 700);

  if (shouldError(true)) {
    throw new Error("Failed to update cart. Please try again.");
  }
}

export async function mutateCartRemove(_params: { id: string }): Promise<void> {
  await delay(500 + Math.random() * 700);

  if (shouldError(true)) {
    throw new Error("Failed to remove item from cart. Please try again.");
  }
}

export async function submitOrder(_orderData: {
  shipping: Record<string, string>;
  payment: Record<string, string>;
  cart: Array<{ id: string; qty: number }>;
}): Promise<{ orderId: string; orderNumber: string }> {
  await delay(800 + Math.random() * 700); // 800-1500ms

  if (shouldError(true)) {
    throw new Error("Order submission failed. Please try again.");
  }

  const orderId = `order-${Date.now()}`;
  const orderNumber = `HH-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;

  return { orderId, orderNumber };
}
