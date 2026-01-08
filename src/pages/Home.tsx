import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchWatches } from "../api/mockApi";
import { WatchCard } from "../components/WatchCard";
import { SkeletonWatchCard } from "../components/SkeletonWatchCard";

const styleCategories = [
  {
    name: "Dress",
    slug: "dress",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    name: "Diver",
    slug: "diver",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    name: "Field",
    slug: "field",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    name: "Chronograph",
    slug: "chronograph",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    name: "GMT",
    slug: "gmt",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
];

export function Home() {
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["watches", { featured: true, pageSize: 8 }],
    queryFn: () => fetchWatches({ pageSize: 8, sort: "featured" }),
  });

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Mechanical Watches, Curated.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Discover precision timepieces from the world's finest watchmakers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/watches"
              className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium focus-ring"
            >
              Shop Watches
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Collection
            </h2>
            <Link
              to="/watches?sort=featured"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonWatchCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredData?.watches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Style */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Style
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {styleCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/watches?complications=${category.name}`}
                className="group relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
