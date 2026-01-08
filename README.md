# HoroHaus - Mechanical Watch E-Commerce Store

A production-quality, frontend-first e-commerce web application for mechanical watches built with React, TypeScript, Vite, and Tailwind CSS.

## 🎯 Project Overview

HoroHaus is a premium e-commerce platform showcasing mechanical watches from renowned brands. The application demonstrates modern React patterns, state management, optimistic UI updates, and performance optimizations.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management (cart)
- **React Hook Form + Zod** - Form handling and validation
- **Framer Motion** - Subtle animations
- **lucide-react** - Icon library

## 📁 Project Structure

```
src/
├── api/
│   └── mockApi.ts          # Mock API with simulated latency/errors
├── components/
│   ├── Header.tsx          # Sticky header with cart badge
│   ├── WatchCard.tsx       # Product card component
│   ├── FiltersSidebar.tsx  # Desktop filters
│   ├── FiltersDrawer.tsx   # Mobile filters drawer
│   ├── SortBar.tsx         # Sorting controls
│   ├── CartItemRow.tsx     # Cart item display
│   ├── QuantityStepper.tsx # Quantity selector
│   ├── PriceSummary.tsx    # Order summary
│   ├── Pagination.tsx      # Page navigation
│   ├── Toast.tsx           # Toast notification
│   ├── ToastProvider.tsx   # Toast context provider
│   ├── ErrorState.tsx      # Error display
│   ├── EmptyState.tsx      # Empty state display
│   └── SkeletonWatchCard.tsx # Loading skeleton
├── hooks/
│   ├── useDebounce.ts      # Debounce hook
│   ├── useLocalStorage.ts  # LocalStorage hook
│   ├── useOptimisticCart.ts # Optimistic cart updates
│   └── usePrefersReducedMotion.ts # Accessibility hook
├── mock/
│   └── watches.ts          # 85 watch products dataset
├── pages/
│   ├── Home.tsx            # Landing page
│   ├── Watches.tsx          # Product listing with filters
│   ├── WatchDetails.tsx     # Product details
│   ├── Cart.tsx             # Shopping cart
│   ├── Checkout.tsx         # 2-step checkout form
│   └── OrderSuccess.tsx     # Order confirmation
├── state/
│   ├── cartStore.ts        # Zustand cart store
│   └── selectors.ts        # Memoized selectors
└── utils/
    ├── formatCurrency.ts    # Currency formatting
    ├── formatSpecs.ts      # Watch specs formatting
    ├── buildQueryString.ts # URL query builder
    └── clamp.ts             # Number clamping
```

## 🏗️ Architecture Decisions

### State Management: Zustand vs Redux Toolkit

**Why Zustand?**
- **Simplicity**: Minimal boilerplate compared to Redux Toolkit
- **Performance**: Lightweight with built-in selector optimization
- **Persistence**: Built-in middleware for localStorage
- **TypeScript**: Excellent type inference out of the box
- **Bundle Size**: Smaller footprint (~1KB vs ~10KB+ for Redux)

For this project, the cart state is relatively simple (just `{watchId, quantity}` pairs), so Zustand's simplicity aligns perfectly with our needs. The cart store uses Zustand's `persist` middleware to automatically sync with localStorage.

### Server State: TanStack Query

TanStack Query handles all server state (product data) with:
- Automatic caching and background refetching
- `keepPreviousData` for smooth pagination transitions
- Built-in loading and error states
- Query invalidation and refetching strategies

### Optimistic UI Updates

The `useOptimisticCart` hook implements optimistic updates for all cart operations:

1. **Immediate UI Update**: Cart state updates instantly
2. **API Call**: Mutation runs in the background
3. **Rollback on Error**: If mutation fails, state reverts to previous value
4. **Toast Notification**: User receives feedback on success/failure

Example flow:
```typescript
// User clicks "Add to Cart"
1. Store previous quantity
2. Update cart state immediately (optimistic)
3. Call mutateCartAdd()
4. On success: Show success toast
5. On error: Rollback to previous state + show error toast
```

### URL Synchronization

All filters, search, sort, and pagination are synchronized with URL query parameters:

- **Benefits**: Shareable links, browser back/forward support, bookmarkable states
- **Implementation**: React Router's `useSearchParams` hook
- **Parsing**: Custom functions parse URL params into filter objects
- **Building**: Query params are rebuilt when filters change

Example URL: `/watches?brand=Seiko&brand=Omega&minPrice=500&maxPrice=2000&sort=price-asc&page=2`

## 🎨 Design System

### Color Palette
- **Accent**: `#1a1a1a` (CSS variable: `--color-accent`)
- **Neutral**: Gray scale (50-900)
- **Background**: White with subtle gray sections

### Typography
- System font stack for optimal performance
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Tight tracking for headings

### Spacing
- Consistent 4px base unit
- Tailwind's spacing scale (0.25rem increments)

## ⚡ Performance Optimizations

### 1. Code Splitting
- All routes lazy-loaded with `React.lazy()`
- Suspense boundaries for loading states
- Reduces initial bundle size

### 2. Image Optimization
- Lazy loading with `loading="lazy"` attribute
- Placeholder images with consistent aspect ratios
- Responsive image sizing

### 3. Memoization
- `WatchCard` wrapped in `React.memo()` to prevent unnecessary re-renders
- Memoized selectors in cart store
- `useMemo` for computed values (cart totals, filtered lists)

### 4. Debouncing
- Search input debounced 300ms to reduce API calls
- Custom `useDebounce` hook

### 5. Query Optimization
- TanStack Query caching (5-minute stale time)
- `keepPreviousData` for pagination (no loading flicker)
- Query keys properly structured for cache invalidation

### 6. Bundle Size
- Tree-shaking enabled
- Only import used icons from lucide-react
- Minimal dependencies

### Performance Checklist
- ✅ Lighthouse Performance >= 90
- ✅ Lighthouse Accessibility >= 90
- ✅ Code splitting implemented
- ✅ Images lazy-loaded
- ✅ Memoization where appropriate
- ✅ Debounced search
- ✅ Optimized re-renders
- ✅ Efficient state subscriptions

## ♿ Accessibility Features

### Semantic HTML
- Proper use of `<header>`, `<main>`, `<nav>`, `<section>`
- Form labels associated with inputs
- ARIA labels for icon-only buttons

### Keyboard Navigation
- All interactive elements keyboard accessible
- Focus visible styles
- Logical tab order

### Screen Readers
- ARIA labels for cart badge, filters drawer
- Descriptive alt text for images
- Error messages associated with form fields

### Reduced Motion
- `usePrefersReducedMotion` hook available
- Respects user's motion preferences

## 🧪 Mock API

The mock API (`src/api/mockApi.ts`) simulates a real backend:

- **Latency**: 500-1200ms random delay
- **Errors**: 10% chance for mutations (add/update/remove cart)
- **Filtering**: Server-side filtering and sorting
- **Pagination**: Server-side pagination

### API Functions



## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app runs on `http://localhost:5173` (or next available port).

### Build & Preview

```bash
# Build
npm run build

# Preview production build locally
npm run preview
```

### Lighthouse Audit

1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools → Lighthouse tab
4. Run audit (Performance + Accessibility)

Expected scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 📝 Features

### Home Page
- Hero section with CTA
- Featured collection (8 watches)
- "Shop by Style" category tiles

### Watches Listing
- Search (debounced, matches brand/model/complications)
- Advanced filters (brand, price, size, movement, etc.)
- Sorting (featured, price, newest, rating)
- Pagination (12 items per page)
- URL synchronization
- Responsive grid layout

### Watch Details
- Image gallery with thumbnails
- Key specifications
- Add to cart with quantity selector
- "You may also like" recommendations
- Authenticity & warranty info

### Shopping Cart
- Persistent cart (localStorage)
- Quantity updates with optimistic UI
- Price summary (subtotal, shipping, tax, total)
- Empty state

### Checkout
- 2-step form (Shipping → Payment)
- Form validation with Zod
- Order review
- Error handling with retry
- Success page with order number

## 🔧 Configuration

### Tailwind CSS
Configuration in `tailwind.config.js`. Custom accent color via CSS variable.

### TanStack Query
Default query options in `src/main.tsx`:
- `staleTime`: 5 minutes
- `refetchOnWindowFocus`: false

### Cart Persistence
Cart automatically persists to localStorage via Zustand's `persist` middleware. Key: `horohaus-cart`.

## 📦 Data Model

Each watch includes:
- Basic info (brand, model, price)
- Movement details (type, caliber, power reserve)
- Case specs (size, material, crystal, water resistance)
- Styling (dial color, strap type)
- Complications array
- Stock status, ratings, reviews
- Images array
- Featured flag

## 🐛 Error Handling

- Network errors: Retry UI with error message
- Form validation: Inline error messages
- Cart mutations: Rollback on failure + toast notification
- Order submission: Error state with retry button

## 🎯 Future Enhancements

Potential improvements:
- User authentication
- Wishlist functionality
- Product reviews and ratings
- Advanced search with autocomplete
- Image zoom on product details
- Cart drawer (slide-out from header)
- Order history
- Email notifications

