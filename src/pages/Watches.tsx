import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchWatches } from "../api/mockApi";
import { WatchCard } from "../components/WatchCard";
import { SkeletonWatchCard } from "../components/SkeletonWatchCard";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { FiltersSidebar } from "../components/FiltersSidebar";
import { FiltersDrawer } from "../components/FiltersDrawer";
import { SortBar, type SortOption } from "../components/SortBar";
import { Pagination } from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import type {
  Brand,
  MovementType,
  CaseMaterial,
  Crystal,
  Strap,
} from "../mock/watches";

interface Filters {
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
}

function parseFiltersFromURL(searchParams: URLSearchParams): Filters {
  const filters: Filters = {};

  const brands = searchParams.getAll("brand");
  if (brands.length > 0) filters.brands = brands as Brand[];

  const minPrice = searchParams.get("minPrice");
  if (minPrice) filters.minPrice = Number(minPrice);

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) filters.maxPrice = Number(maxPrice);

  const caseSizeMin = searchParams.get("caseSizeMin");
  if (caseSizeMin) filters.caseSizeMin = Number(caseSizeMin);

  const caseSizeMax = searchParams.get("caseSizeMax");
  if (caseSizeMax) filters.caseSizeMax = Number(caseSizeMax);

  const movementType = searchParams.getAll("movementType");
  if (movementType.length > 0)
    filters.movementType = movementType as MovementType[];

  const waterResistance = searchParams.getAll("waterResistance").map(Number);
  if (waterResistance.length > 0) filters.waterResistance = waterResistance;

  const caseMaterial = searchParams.getAll("caseMaterial");
  if (caseMaterial.length > 0)
    filters.caseMaterial = caseMaterial as CaseMaterial[];

  const crystal = searchParams.getAll("crystal");
  if (crystal.length > 0) filters.crystal = crystal as Crystal[];

  const strap = searchParams.getAll("strap");
  if (strap.length > 0) filters.strap = strap as Strap[];

  const complications = searchParams.getAll("complications");
  if (complications.length > 0) filters.complications = complications;

  const inStock = searchParams.get("inStock");
  if (inStock === "true") filters.inStock = true;

  const minRating = searchParams.get("minRating");
  if (minRating) filters.minRating = Number(minRating);

  return filters;
}

function buildFiltersURL(filters: Filters): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};

  if (filters.brands && filters.brands.length > 0)
    params.brand = filters.brands;
  if (filters.minPrice !== undefined)
    params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined)
    params.maxPrice = String(filters.maxPrice);
  if (filters.caseSizeMin !== undefined)
    params.caseSizeMin = String(filters.caseSizeMin);
  if (filters.caseSizeMax !== undefined)
    params.caseSizeMax = String(filters.caseSizeMax);
  if (filters.movementType && filters.movementType.length > 0)
    params.movementType = filters.movementType;
  if (filters.waterResistance && filters.waterResistance.length > 0) {
    params.waterResistance = filters.waterResistance.map(String);
  }
  if (filters.caseMaterial && filters.caseMaterial.length > 0)
    params.caseMaterial = filters.caseMaterial;
  if (filters.crystal && filters.crystal.length > 0)
    params.crystal = filters.crystal;
  if (filters.strap && filters.strap.length > 0) params.strap = filters.strap;
  if (filters.complications && filters.complications.length > 0)
    params.complications = filters.complications;
  if (filters.inStock) params.inStock = "true";
  if (filters.minRating !== undefined)
    params.minRating = String(filters.minRating);

  return params;
}

export function Watches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);
  const page = Number(searchParams.get("page")) || 1;
  const sort = (searchParams.get("sort") || "featured") as SortOption;
  const filters = useMemo(
    () => parseFiltersFromURL(searchParams),
    [searchParams]
  );

  // Update URL when search changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newParams.set("search", debouncedSearch);
      newParams.set("page", "1");
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["watches", { page, search: debouncedSearch, filters, sort }],
    queryFn: () =>
      fetchWatches({
        page,
        pageSize: 12,
        search: debouncedSearch,
        filters,
        sort,
      }),
    keepPreviousData: true,
  });

  const handleFiltersChange = (newFilters: Filters) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("page");

    // Clear all filter params
    [
      "brand",
      "minPrice",
      "maxPrice",
      "caseSizeMin",
      "caseSizeMax",
      "movementType",
      "waterResistance",
      "caseMaterial",
      "crystal",
      "strap",
      "complications",
      "inStock",
      "minRating",
    ].forEach((key) => {
      newParams.delete(key);
    });

    // Add new filter params
    const filterParams = buildFiltersURL(newFilters);
    Object.entries(filterParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v));
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    [
      "brand",
      "minPrice",
      "maxPrice",
      "caseSizeMin",
      "caseSizeMax",
      "movementType",
      "waterResistance",
      "caseMaterial",
      "crystal",
      "strap",
      "complications",
      "inStock",
      "minRating",
    ].forEach((key) => {
      newParams.delete(key);
    });
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: SortOption) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search watches..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus-ring"
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <SortBar
              sort={sort}
              onSortChange={handleSortChange}
              onFiltersToggle={() => setFiltersDrawerOpen(true)}
              showFiltersButton={true}
            />

            {/* Mobile Filters Drawer */}
            <FiltersDrawer
              isOpen={filtersDrawerOpen}
              onClose={() => setFiltersDrawerOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />

            {error ? (
              <ErrorState
                message="Failed to load watches"
                onRetry={() => refetch()}
              />
            ) : isLoading && !data ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonWatchCard key={i} />
                ))}
              </div>
            ) : data && data.watches.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {data.watches.map((watch) => (
                    <WatchCard key={watch.id} watch={watch} />
                  ))}
                </div>
                {data.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={data.page}
                      totalPages={data.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
