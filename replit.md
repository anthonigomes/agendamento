# Laboratory Computer Room Scheduling System

## Overview

This is an educational scheduling application for managing computer laboratory bookings in a school environment. The system allows teachers to book time slots across three daily shifts (morning, afternoon, and evening) throughout the work week. Built with a modern React frontend and Express backend, it emphasizes clarity, efficiency, and ease of use for busy educators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: shadcn/ui components (Radix UI primitives) following the "New York" style variant. This provides accessible, customizable components built on top of Radix UI primitives with Tailwind CSS for styling.

**Design Philosophy**: Material Design principles adapted for educational contexts, prioritizing clarity, efficiency, and trustworthiness. Typography uses Roboto font family for consistency with the Google ecosystem.

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form state
- Local React state for UI interactions

**Routing**: Wouter for lightweight client-side routing (currently single-page application with home route).

**Styling System**: Tailwind CSS with custom design tokens using CSS variables for theming. Supports light/dark mode through a custom theme provider. Design tokens include semantic color system (primary, secondary, destructive, muted, accent) with HSL values for alpha transparency support.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript, using ES modules.

**API Design**: RESTful endpoints under `/api` namespace:
- `POST /api/bookings` - Create new booking with conflict detection
- `GET /api/bookings` - Retrieve all bookings

**Validation**: Zod schemas shared between frontend and backend for type-safe validation. Server-side validation includes business logic for detecting time slot conflicts (overlapping bookings within same shift/day).

**Request Processing**: Express middleware for JSON parsing, raw body capture, and request/response logging.

**Development Server**: Vite dev server integrated with Express in middleware mode for HMR (Hot Module Replacement) during development.

### Data Storage Solutions

**Primary Storage**: Google Sheets integration via Google Sheets API v4 and OAuth2 authentication. The system creates and manages a spreadsheet for storing booking data.

**Authentication Flow**: Uses Replit Connectors system for managing Google OAuth credentials, with automatic token refresh handling.

**Database Schema** (defined for potential PostgreSQL migration):
- **bookings** table: Stores professor name, subject, shift (morning/afternoon/evening), day of week, start time, duration (1-2 class periods), optional notes, timestamps
- **users** table: Basic username/password structure (currently unused, template remnant)

**ORM**: Drizzle ORM configured for PostgreSQL with schema definitions and migration support, though currently using Google Sheets as the active storage backend.

### Authentication and Authorization

Currently no authentication system is implemented. The users table exists in the schema but is not actively used. The application is designed for internal school use where access control may be handled at the network level.

### External Dependencies

**Third-Party Services**:
- **Google Sheets API**: Primary data storage backend accessed via `@googleapis/sheets`
- **Replit Connectors**: OAuth credential management for Google Sheets integration
- **Neon Database**: PostgreSQL database provider (configured but not actively used)

**Key NPM Packages**:
- **@neondatabase/serverless**: PostgreSQL driver for Neon
- **drizzle-orm** & **drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **react-hook-form** & **@hookform/resolvers**: Form handling
- **zod** & **drizzle-zod**: Runtime type validation
- **date-fns**: Date manipulation utilities
- **class-variance-authority** & **clsx**: Utility-first CSS class management
- **Radix UI** component primitives (accordion, dialog, select, etc.)

**Development Tools**:
- **Vite**: Build tool and dev server
- **esbuild**: Production server bundling
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling framework
- **PostCSS** with Autoprefixer: CSS processing

**Google Fonts CDN**: Roboto font family loaded via Google Fonts for consistent typography.