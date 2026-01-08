import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "./components/Header";
import { ToastProvider } from "./components/ToastProvider";
import { SkeletonWatchCard } from "./components/SkeletonWatchCard";

const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home }))
);
const Watches = lazy(() =>
  import("./pages/Watches").then((m) => ({ default: m.Watches }))
);
const WatchDetails = lazy(() =>
  import("./pages/WatchDetails").then((m) => ({ default: m.WatchDetails }))
);
const Cart = lazy(() =>
  import("./pages/Cart").then((m) => ({ default: m.Cart }))
);
const Checkout = lazy(() =>
  import("./pages/Checkout").then((m) => ({ default: m.Checkout }))
);
const OrderSuccess = lazy(() =>
  import("./pages/OrderSuccess").then((m) => ({ default: m.OrderSuccess }))
);

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonWatchCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Header />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/watches/:id" element={<WatchDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
