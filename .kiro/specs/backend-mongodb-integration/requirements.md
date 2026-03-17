# Requirements Document

## Introduction

This feature replaces the current hardcoded mock data and localStorage-based admin functionality in the Pratipal wellness/healing platform with a real backend API (Node.js/Express) backed by MongoDB. It introduces real product data for Indian users with INR currency pricing — including healing candles, therapeutic salts, and essential oil blends — and exposes REST API endpoints consumed by the existing Next.js 15 frontend.

## Glossary

- **API_Server**: The Node.js/Express backend application that handles all data operations
- **Database**: The MongoDB instance storing all persistent application data
- **Product**: A Pratipal wellness item (healing candle, therapeutic salt, essential oil blend) with INR pricing
- **Admin**: An authenticated user with permission to create, update, and delete products
- **Frontend**: The existing Next.js 15 application at `pratipal-nextjs/`
- **Seed_Script**: A script that populates the Database with initial real Pratipal product data
- **Product_Repository**: The data access layer that abstracts MongoDB queries for products

---

## Requirements

### Requirement 1: Product Data Model with INR Pricing

**User Story:** As a developer, I want a well-defined product schema with INR pricing, so that all product data is consistent and suitable for Indian users.

#### Acceptance Criteria

1. THE Product SHALL have the following fields: `id`, `name`, `slug`, `category`, `price` (in INR paise as integer), `currency` (fixed to "INR"), `description`, `shortDescription`, `images` (array of URLs), `ingredients`, `benefits`, `weight`, `inStock`, `stockCount`, `tags`, `createdAt`, `updatedAt`
2. THE Database SHALL enforce that `price` is a non-negative integer representing paise (e.g., ₹499 = 49900)
3. THE Database SHALL enforce that `slug` is unique across all products
4. THE Database SHALL enforce that `name` and `category` are non-empty strings
5. WHEN a product is created or updated, THE Database SHALL automatically set `updatedAt` to the current timestamp

---

### Requirement 2: Seed Real Pratipal Product Data

**User Story:** As a developer, I want the database seeded with real Pratipal product data, so that the platform launches with meaningful content for Indian users.

#### Acceptance Criteria

1. THE Seed_Script SHALL insert a minimum of 10 products across the categories: healing candles, therapeutic salts, and essential oil blends
2. THE Seed_Script SHALL set all product prices in INR with reasonable Indian market pricing (e.g., ₹199–₹999 range for individual items, ₹1499–₹2499 for hampers/bundles)
3. THE Seed_Script SHALL be idempotent — running it multiple times SHALL NOT create duplicate products
4. WHEN the Seed_Script is run against a non-empty Database, THE Seed_Script SHALL skip products whose `slug` already exists
5. THE Seed_Script SHALL log the count of inserted and skipped products upon completion

---

### Requirement 3: Product Listing API

**User Story:** As a frontend developer, I want a product listing endpoint, so that the shop page can display real products from the database.

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/products`, THE API_Server SHALL return a JSON array of all in-stock and out-of-stock products
2. WHEN a `category` query parameter is provided, THE API_Server SHALL return only products matching that category
3. WHEN a `inStock` query parameter is set to `true`, THE API_Server SHALL return only products where `inStock` is true
4. WHEN a `minPrice` or `maxPrice` query parameter is provided (in paise), THE API_Server SHALL filter products within that price range
5. THE API_Server SHALL return products sorted by `createdAt` descending by default
6. WHEN the Database is unreachable, THE API_Server SHALL return HTTP 503 with a JSON error body `{ "error": "Service unavailable" }`

---

### Requirement 4: Single Product Detail API

**User Story:** As a frontend developer, I want a product detail endpoint, so that the product detail page can display full product information.

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/products/:id`, THE API_Server SHALL return the full product document as JSON
2. WHEN a GET request is made to `/api/products/slug/:slug`, THE API_Server SHALL return the full product document matching that slug
3. IF no product matches the provided `id` or `slug`, THEN THE API_Server SHALL return HTTP 404 with body `{ "error": "Product not found" }`
4. IF the provided `id` is not a valid MongoDB ObjectId format, THEN THE API_Server SHALL return HTTP 400 with body `{ "error": "Invalid product ID" }`

---

### Requirement 5: Admin Product Management API

**User Story:** As an admin, I want API endpoints to create, update, and delete products, so that I can manage the product catalogue without touching the database directly.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/admin/products` with a valid product body, THE API_Server SHALL create a new product and return HTTP 201 with the created product
2. WHEN a PUT request is made to `/api/admin/products/:id` with a valid update body, THE API_Server SHALL update the product and return HTTP 200 with the updated product
3. WHEN a DELETE request is made to `/api/admin/products/:id`, THE API_Server SHALL remove the product and return HTTP 200 with body `{ "message": "Product deleted" }`
4. IF a POST or PUT request body is missing required fields (`name`, `price`, `category`), THEN THE API_Server SHALL return HTTP 400 with a descriptive validation error
5. IF a PUT or DELETE request references a non-existent product `id`, THEN THE API_Server SHALL return HTTP 404 with body `{ "error": "Product not found" }`
6. THE API_Server SHALL auto-generate `slug` from `name` when not explicitly provided in a POST request

---

### Requirement 6: Frontend Integration — Replace Mock Data

**User Story:** As a developer, I want the Next.js frontend to fetch products from the API instead of using hardcoded data, so that the shop reflects real database content.

#### Acceptance Criteria

1. THE Frontend SHALL fetch products from the API_Server via a configurable base URL set in an environment variable (`NEXT_PUBLIC_API_URL`)
2. WHEN the API_Server returns products, THE Frontend SHALL display prices formatted as Indian Rupees (e.g., "₹499")
3. THE Frontend SHALL replace the `useProducts` hook's localStorage logic with API calls using `fetch` or a lightweight client
4. WHEN the API request is in-flight, THE Frontend SHALL display a loading skeleton in place of product cards
5. IF the API request fails, THE Frontend SHALL display a user-friendly error message and a retry option
6. THE Frontend admin dashboard SHALL call the admin API endpoints for create and delete operations instead of writing to localStorage

---

### Requirement 7: API Server Configuration and Health

**User Story:** As a developer, I want the API server to be configurable and observable, so that it can be deployed and monitored reliably.

#### Acceptance Criteria

1. THE API_Server SHALL read its MongoDB connection string from an environment variable `MONGODB_URI`
2. THE API_Server SHALL read its listening port from an environment variable `PORT`, defaulting to `4000`
3. WHEN a GET request is made to `/health`, THE API_Server SHALL return HTTP 200 with body `{ "status": "ok", "timestamp": "<ISO timestamp>" }`
4. WHEN the API_Server starts successfully, THE API_Server SHALL log the port it is listening on and the MongoDB connection status
5. IF the `MONGODB_URI` environment variable is not set, THEN THE API_Server SHALL exit with a non-zero code and log a descriptive error message
6. THE API_Server SHALL enable CORS for requests originating from the `NEXT_PUBLIC_FRONTEND_URL` environment variable

---

### Requirement 8: Data Serialization and Round-Trip Integrity

**User Story:** As a developer, I want product data to serialize and deserialize correctly between MongoDB and JSON, so that no data is lost or corrupted in transit.

#### Acceptance Criteria

1. THE Product_Repository SHALL serialize MongoDB documents to JSON-safe objects (converting `_id` to `id` as a string)
2. THE Product_Repository SHALL deserialize incoming JSON request bodies into valid MongoDB document structures before writing
3. FOR ALL valid Product objects, serializing then deserializing SHALL produce an equivalent object (round-trip property)
4. WHEN a product contains a `price` field, THE Product_Repository SHALL preserve the exact integer value without floating-point conversion
