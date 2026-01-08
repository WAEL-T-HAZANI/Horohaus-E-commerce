import { memo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Watch } from "../mock/watches";
import { formatCurrency } from "../utils/formatCurrency";

interface WatchCardProps {
  watch: Watch;
}

export const WatchCard = memo(function WatchCard({ watch }: WatchCardProps) {
  return (
    <Link
      to={`/watches/${watch.id}`}
      className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={watch.images[0]}
          alt={`${watch.brand} ${watch.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {watch.featured && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
            Featured
          </span>
        )}
        {!watch.inStock && (
          <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm">{watch.brand}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{watch.rating}</span>
            <span className="text-gray-400">({watch.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{watch.model}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(watch.price)}
          </span>
          <span className="text-xs text-gray-500">
            {watch.caseSizeMm}mm
          </span>
        </div>
      </div>
    </Link>
  );
});

