import { useState } from "react";
import { X } from "lucide-react";
import type {
  Brand,
  MovementType,
  CaseMaterial,
  Crystal,
  Strap,
} from "../mock/watches";
import { brands } from "../mock/watches";

const complicationsList = [
  "Date",
  "Chronograph",
  "GMT",
  "Moonphase",
  "Power Reserve",
  "Day-Date",
  "Tachymeter",
  "Small Seconds",
  "24-Hour",
];

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

interface FiltersSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
}

export function FiltersSidebar({
  filters,
  onFiltersChange,
  onClear,
}: FiltersSidebarProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice?.toString() || "",
    max: filters.maxPrice?.toString() || "",
  });

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = <K extends keyof Filters>(
    key: K,
    value: string
  ) => {
    const current = (localFilters[key] as string[]) || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, newValue as Filters[K]);
  };

  const handlePriceApply = () => {
    const min = priceRange.min ? Number(priceRange.min) : undefined;
    const max = priceRange.max ? Number(priceRange.max) : undefined;
    updateFilter("minPrice", min);
    updateFilter("maxPrice", max);
  };

  const hasActiveFilters = Object.keys(localFilters).some((key) => {
    const value = localFilters[key as keyof Filters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <aside className="w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.brands?.includes(brand) || false}
                onChange={() => toggleArrayFilter("brands", brand)}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-ring"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-ring"
            />
          </div>
          <button
            onClick={handlePriceApply}
            className="w-full px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm focus-ring"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Case Size */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Case Size</h3>
        <div className="space-y-2">
          {[
            { label: "36-38mm", min: 36, max: 38 },
            { label: "39-41mm", min: 39, max: 41 },
            { label: "42mm+", min: 42, max: 50 },
          ].map(({ label, min, max }) => (
            <label key={label} className="flex items-center">
              <input
                type="checkbox"
                checked={
                  localFilters.caseSizeMin === min &&
                  localFilters.caseSizeMax === max
                }
                onChange={() => {
                  if (
                    localFilters.caseSizeMin === min &&
                    localFilters.caseSizeMax === max
                  ) {
                    updateFilter("caseSizeMin", undefined);
                    updateFilter("caseSizeMax", undefined);
                  } else {
                    updateFilter("caseSizeMin", min);
                    updateFilter("caseSizeMax", max);
                  }
                }}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Movement Type */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Movement</h3>
        <div className="space-y-2">
          {(["Automatic", "Manual"] as MovementType[]).map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.movementType?.includes(type) || false}
                onChange={() => toggleArrayFilter("movementType", type)}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Water Resistance */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Water Resistance
        </h3>
        <div className="space-y-2">
          {[30, 100, 200, 300].map((wr) => (
            <label key={wr} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.waterResistance?.includes(wr) || false}
                onChange={() =>
                  toggleArrayFilter("waterResistance", wr.toString())
                }
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{wr}m+</span>
            </label>
          ))}
        </div>
      </div>

      {/* Case Material */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Case Material
        </h3>
        <div className="space-y-2">
          {(
            [
              "Stainless Steel",
              "Titanium",
              "Bronze",
              "Ceramic",
            ] as CaseMaterial[]
          ).map((material) => (
            <label key={material} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.caseMaterial?.includes(material) || false}
                onChange={() => toggleArrayFilter("caseMaterial", material)}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Crystal */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Crystal</h3>
        <div className="space-y-2">
          {(["Sapphire", "Hardlex", "Mineral"] as Crystal[]).map((crystal) => (
            <label key={crystal} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.crystal?.includes(crystal) || false}
                onChange={() => toggleArrayFilter("crystal", crystal)}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{crystal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Strap */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Strap</h3>
        <div className="space-y-2">
          {(["Leather", "Bracelet", "NATO", "Rubber"] as Strap[]).map(
            (strap) => (
              <label key={strap} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.strap?.includes(strap) || false}
                  onChange={() => toggleArrayFilter("strap", strap)}
                  className="rounded border-gray-300 text-accent focus:ring-gray-900"
                />
                <span className="ml-2 text-sm text-gray-700">{strap}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Complications */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Complications
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {complicationsList.map((comp) => (
            <label key={comp} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.complications?.includes(comp) || false}
                onChange={() => toggleArrayFilter("complications", comp)}
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">{comp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={localFilters.inStock || false}
            onChange={(e) =>
              updateFilter("inStock", e.target.checked ? true : undefined)
            }
            className="rounded border-gray-300 text-accent focus:ring-gray-900"
          />
          <span className="ml-2 text-sm text-gray-700">In stock only</span>
        </label>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.minRating === rating}
                onChange={(e) =>
                  updateFilter(
                    "minRating",
                    e.target.checked ? rating : undefined
                  )
                }
                className="rounded border-gray-300 text-accent focus:ring-gray-900"
              />
              <span className="ml-2 text-sm text-gray-700">
                {rating}+ stars
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
