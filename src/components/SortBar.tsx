import { Filter } from "lucide-react";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

interface SortBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFiltersToggle?: () => void;
  showFiltersButton?: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "New Arrivals" },
  { value: "rating", label: "Highest Rated" },
];

export function SortBar({
  sort,
  onSortChange,
  onFiltersToggle,
  showFiltersButton = false,
}: SortBarProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        {showFiltersButton && onFiltersToggle && (
          <button
            onClick={onFiltersToggle}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus-ring"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        )}
        <span className="text-sm text-gray-600">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus-ring bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
