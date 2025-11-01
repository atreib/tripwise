# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tripwise is an AI-powered travel planning application built with Next.js 15 that generates personalized travel recommendations, itineraries, and travel information using OpenAI's API.

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
cp .env.sample .env           # Create environment file (fill in required values)
docker-compose up -d          # Start local PostgreSQL database
npm run migrate:latest        # Run all database migrations
```

### Development
```bash
npm run dev                   # Start Next.js dev server with Turbopack (http://localhost:3000)
npm run build                 # Build production bundle
npm start                     # Start production server
npm run lint                  # Run ESLint
```

### Database Migrations
```bash
npm run migrate:make <name>   # Create new migration file
npm run migrate:up            # Run next migration
npm run migrate:down          # Rollback last migration
npm run migrate:latest        # Run all pending migrations
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with React Server Components (RSC) and Server Actions
- **Database**: PostgreSQL (single database) with Kysely as the type-safe query builder
- **Authentication**: Clerk (userId is a string type)
- **AI**: OpenAI API for generating travel recommendations
- **Email**: Resend for transactional emails
- **Analytics**: PostHog for product analytics
- **Styling**: Tailwind CSS with shadcn/ui components (Radix UI primitives)

### File Naming Conventions

The codebase uses explicit file suffixes to distinguish between client and server components:
- `.client.tsx` - Client Components (use client interactivity, hooks, event handlers)
- `.server.tsx` - Server Components (async, direct DB access, server-only operations)
- `.tsx` - Can be either, but typically Server Components in app directory

### Service Layer Architecture

The codebase follows a **service-oriented architecture** with all business logic centralized in `src/lib/` services:

#### Core Services (`src/lib/`)
- **`trips-service/`** - Core trip creation and management logic
  - Uses OpenAI to generate trip data (summaries, packing lists, points of interest, etc.)
  - All AI prompts are in `prompts/` subdirectory
  - Handles trip CRUD operations and related data (packing lists, documents, local food, etiquettes, attractions)
- **`backpack-service/`** - Backpack management (unrelated to trips)
  - Handles backpack CRUD operations and item management
  - Users can create multiple backpacks with items (simple string lists)
  - Supports add, update, delete operations for both backpacks and items
- **`auth-service/`** - Authentication via Clerk
  - `getAuthSession()` - Returns userId or undefined
  - `requireAuthSession()` - Returns userId or redirects to login
- **`user-service/`** - User management and role-based access
- **`destinations-service/`** - Destination data and search
- **`analytics-service/`** - PostHog integration for tracking
- **`feedback-service/`** - User feedback collection (beta users)
- **`db/`** - Database connection and Kysely setup
  - Migrations in `db/migrations/`
  - Database types generated from migrations

#### Service Pattern
All services use the factory pattern: `export function get{Service}Name() { return { ...methods } }`

Example usage:
```typescript
import { getTripsService } from "@/lib/trips-service";
const trip = await getTripsService().getTripById({ tripId });
```

### Server Actions with next-safe-action

Server actions use `next-safe-action` library with three client types in `src/lib/safe-actions/`:
- **`unauthenticatedActionClient`** - Public actions
- **`authenticatedActionClient`** - Requires authentication (provides `userId` in context)
- **`authenticatedBetaUserActionClient`** - Requires beta/staff role

Actions are defined in `actions.ts` files colocated with routes (e.g., `src/app/dashboard/trips/actions.ts`).

### Database Schema

Key tables:
- `trip` - Main trip records with userId, destination, dates, and AI-generated fields (summary, currency, dailyCost)
- `trip_packing_list` - Packing items per trip
- `trip_documents` - Required travel documents per trip
- `trip_local_etiquette` - Cultural etiquette tips per trip
- `trip_local_food` - Food recommendations per trip
- `trip_points_of_interest` - Attractions and POIs per trip
- `backpack` - User-created backpacks with name and created_at timestamp
- `backpack_item` - Items within backpacks (simple string items)
- `user` - User profiles with role field (beta, staff, or regular)
- `feedback` - Beta user feedback

### AI Integration

Trip creation triggers parallel AI generation for:
- Trip summary
- Local currency
- Daily cost estimate
- Packing list
- Points of interest
- Required documents
- Local etiquettes
- Food recommendations

Each generation has a dedicated prompt file in `src/lib/trips-service/prompts/`.

### Component Organization

- `src/app/` - Next.js app router pages and layouts
- `src/components/ui/` - Reusable shadcn/ui components (from Radix UI)
- Components are colocated with their routes in the app directory
- Server and client components are explicitly separated with file suffixes

### Authentication Flow

1. Clerk handles auth UI at `/sign-in` and `/sign-up` routes
2. After signup, redirects to `/api/auth/callback` which creates user record
3. Session is checked via `getAuthService().requireAuthSession()` in protected routes
4. User roles (beta/staff) gate access to certain features

### Environment Variables

Required variables (see `.env.sample`):
- Clerk keys for authentication
- Database connection details (Docker Compose provides defaults)
- OpenAI API key
- Resend API key for emails
- PostHog keys for analytics
- APP_URL for site URL

### Docker Setup

`docker-compose.yml` provides local PostgreSQL:
- Container: `tripwise-postgres`
- Port: 5432
- User: admin / Password: password
- Database: tripwise

## Development Patterns

### Route Protection
Protected routes use `getAuthService().requireAuthSession()` which redirects unauthenticated users to `/` (homepage).

### Data Fetching
Server Components fetch data directly using service methods. No client-side data fetching libraries needed.

### Caching Strategy
Multiple TODO comments indicate plans to add caching + revalidation to decrease compute time (see trips-service).

### Path Aliases
Use `@/` for imports from `src/`: `import { db } from "@/lib/db"`
