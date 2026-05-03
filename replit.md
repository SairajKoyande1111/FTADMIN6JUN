# FishTokri Admin — Workspace

## Overview

FishTokri Admin is a pnpm monorepo project providing a comprehensive administration panel for the FishTokri platform. It features an Express 5 and MongoDB-based backend, coupled with a React 19, Vite 7, and TailwindCSS 4 frontend. The system supports various administrative roles, including Master Admin, Super Hub, Sub Hub, and Delivery Person, each with role-based access control and data scoping. The primary purpose is to manage hubs, orders, inventory, vendors, banking, and customer data, along with specific menu management for individual sub-hubs. The project aims to streamline FishTokri's operational workflows and enhance its market presence through efficient administration.

## User Preferences

I prefer iterative development with clear communication at each major step. Please ask before making significant architectural changes or adding new external dependencies. I also prefer detailed explanations for complex logic or design decisions.

## System Architecture

The project is structured as a pnpm monorepo containing an `api-server` (Express 5 backend) and `fishtokri-admin` (React frontend).

**UI/UX Decisions:**
- **Unified UI Shell:** All admin roles share the same React UI shell, with role-based visibility of sections and dynamic navigation filtering.
- **Brand Palette:**
    - **Primary:** `#F05B4E` (pink/coral) for primary actions, icons, highlights.
    - **Secondary:** `#364F9F` (deep blue) for secondary buttons, links, heading accents.
    - Colors are accessible via Tailwind utilities (`bg-brand-primary`, `text-brand-secondary`) and TypeScript exports (`BRAND_COLORS`).
- **Iconography:** Uses CSS `mask-image` for tinting black-silhouette PNG icons with brand colors.

**Technical Implementations & Design Choices:**
- **Monorepo:** Managed with pnpm workspaces for a unified development environment.
- **Backend:** Node.js 24, Express 5, TypeScript 5.9.
- **Frontend:** React 19, Vite 7, TailwindCSS 4, Wouter for routing, TanStack React Query 5 for state and data fetching.
- **Authentication:** JWT-based for API authentication.
- **Validation:** Zod for schema validation.
- **Role-Based Access Control (RBAC):**
    - **Frontend:** Route gating via `<ProtectedRoute allowedRoles=[...] />` and sidebar navigation filtering.
    - **Backend:** API enforces hub scope using `loadScope` middleware (`req.scope`) and `denyIfNotMaster` or `rejectIfNotMaster` helpers. Out-of-scope reads return 404, writes 403.
- **Hub Hierarchy:** Supports Super Hubs (city level) and Sub Hubs (locality level), with Sub Hubs storing pincode arrays.
- **Database Architecture:**
    - MongoDB (Mongoose) as the primary database.
    - Centralized collections for `super_hubs`, `sub_hubs`, `hub_users`, `vendor_item_categories`, `vendor_items`, `vendor_purchases`.
    - **Per-Sub-Hub Databases:** Each sub-hub connects to its own dedicated MongoDB database (specified by `SubHub.dbName`) for menu-related data like `products`, `categories`, `combos`, `coupons`, `carousels`, `sections`, `pincodes`, and `timeslots`.
- **Inventory Management:**
    - Vendor items include rich attributes (SKU, type, prices, stock, unit).
    - Vendor Categories can link to sub-hub menu categories.
    - Stock Adjustment is batched and requires selecting Super Hub and Sub Hub context.
    - Product batches track quantity, shelf life, received/expiry dates, and notes, with FIFO consumption for reductions.
- **API Structure:** Organized into routes for `super-hubs`, `sub-hubs`, `users`, `stats`, `orders`, `vendors`, and dedicated per-sub-hub menu routes.

## External Dependencies

- **MongoDB Atlas:** Cloud database service for primary data storage.
- **Cloudinary:** Image upload and management service (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- **jsonwebtoken:** Library for JWT authentication.
- **pino:** Logger for the API server.
- **Zod:** Schema declaration and validation library.
- **TanStack React Query:** Data fetching and state management for React.
- **Wouter:** React routing library.