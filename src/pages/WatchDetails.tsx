import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, Shield, Truck } from "lucide-react";
import { fetchWatchById, fetchWatches } from "../api/mockApi";
import { formatCurrency } from "../utils/formatCurrency";
import { QuantityStepper } from "../components/QuantityStepper";
import { ErrorState } from "../components/ErrorState";
import { WatchCard } from "../components/WatchCard";
import { useOptimisticCart } from "../hooks/useOptimisticCart";
import { useState } from "react";

export function WatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, isUpdating } = useOptimisticCart();

  const {
    data: watch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["watch", id],
    queryFn: () => fetchWatchById(id!),
    enabled: !!id,
  });

  const { data: relatedWatches } = useQuery({
    queryKey: ["watches", "related", watch?.brand],
    queryFn: () =>
      fetchWatches({
        filters: watch ? { brands: [watch.brand] } : undefined,
        pageSize: 4,
      }),
    enabled: !!watch,
  });

  const handleAddToCart = async () => {
    if (!watch || !watch.inStock) return;
    await addToCart(watch.id, quantity);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !watch) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState
            message="Watch not found"
            onRetry={() => navigate("/watches")}
          />
        </div>
      </main>
    );
  }

  const related =
    relatedWatches?.watches.filter((w) => w.id !== watch.id).slice(0, 4) || [];

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/watches"
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to Watches
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={watch.images[selectedImageIndex]}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {watch.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-accent"
                      : "border-transparent hover:border-gray-300"
                  } transition-colors`}
                >
                  <img
                    src={image}
                    alt={`${watch.brand} ${watch.model} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {watch.brand} {watch.model}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span>{watch.rating}</span>
                </div>
                <span>•</span>
                <span>{watch.reviewCount} reviews</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {formatCurrency(watch.price)}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {watch.caseSizeMm}mm
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {watch.waterResistanceM}m WR
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {watch.movementType}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {watch.powerReserveHours}h power
                </span>
              </div>
            </div>

            {watch.inStock ? (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    disabled={isUpdating === watch.id}
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isUpdating === watch.id}
                  className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                >
                  {isUpdating === watch.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <button
                  disabled
                  className="w-full px-6 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                >
                  Out of Stock
                </button>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Authenticity & Warranty
                  </h3>
                  <p className="text-sm text-gray-600">
                    All watches are authentic and come with a 2-year
                    manufacturer warranty.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Free Shipping
                  </h3>
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over $500. Express delivery
                    available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{watch.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Specifications
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600">Brand</dt>
                <dd className="font-medium text-gray-900">{watch.brand}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Model</dt>
                <dd className="font-medium text-gray-900">{watch.model}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Movement</dt>
                <dd className="font-medium text-gray-900">
                  {watch.movementType} ({watch.caliber})
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Power Reserve</dt>
                <dd className="font-medium text-gray-900">
                  {watch.powerReserveHours} hours
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Case Size</dt>
                <dd className="font-medium text-gray-900">
                  {watch.caseSizeMm}mm
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Case Material</dt>
                <dd className="font-medium text-gray-900">
                  {watch.caseMaterial}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Crystal</dt>
                <dd className="font-medium text-gray-900">{watch.crystal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Water Resistance</dt>
                <dd className="font-medium text-gray-900">
                  {watch.waterResistanceM}m
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Strap</dt>
                <dd className="font-medium text-gray-900">{watch.strap}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Dial Color</dt>
                <dd className="font-medium text-gray-900">{watch.dialColor}</dd>
              </div>
              {watch.complications.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Complications</dt>
                  <dd className="font-medium text-gray-900">
                    {watch.complications.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((w) => (
                <WatchCard key={w.id} watch={w} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
